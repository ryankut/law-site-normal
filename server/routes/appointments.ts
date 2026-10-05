import { Router } from 'express';
import { prisma } from '../prisma.js';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';
import nodemailer from 'nodemailer';

const router = Router();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Get available slots
router.get('/available-slots', async (req, res) => {
  try {
    const { date, duration = 60 } = req.query;
    const queryDate = new Date(date as string);
    
    // Get all appointments for the date
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(queryDate.setHours(0, 0, 0, 0)),
          lt: new Date(queryDate.setHours(24, 0, 0, 0)),
        },
        status: { not: 'CANCELLED' },
      },
      select: { date: true, duration: true },
    });

    // Generate available slots (9 AM to 5 PM, excluding lunch 12-1 PM)
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const lunchStart = 12;
    const lunchEnd = 13;

    for (let hour = startHour; hour < endHour; hour++) {
      if (hour >= lunchStart && hour < lunchEnd) continue;
      
      const slotTime = new Date(queryDate);
      slotTime.setHours(hour, 0, 0, 0);
      
      const slotEnd = new Date(slotTime);
      slotEnd.setMinutes(slotEnd.getMinutes() + parseInt(duration as string));

      // Check if slot conflicts with existing appointments
      const isAvailable = !appointments.some(apt => {
        const aptStart = new Date(apt.date);
        const aptEnd = new Date(aptStart);
        aptEnd.setMinutes(aptEnd.getMinutes() + apt.duration);
        
        return (slotTime < aptEnd && slotEnd > aptStart);
      });

      if (isAvailable && slotTime > new Date()) {
        slots.push({
          time: slotTime.toISOString(),
          display: slotTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        });
      }
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get available slots' });
  }
});

// Get all appointments (admin only)
router.get('/', authenticate, requireRole('ADMIN', 'ATTORNEY'), async (req, res) => {
  try {
    const { status, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom as string);
      if (dateTo) where.date.lte = new Date(dateTo as string);
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.appointment.count({ where }),
    ]);

    res.json({
      appointments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Get client's appointments
router.get('/my-appointments', authenticate, requireRole('CLIENT'), async (req: AuthRequest, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { clientId: req.user!.id },
      orderBy: { date: 'desc' },
    });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get appointments' });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const { date, type, notes, firstName, lastName, email, phone, depositAmount } = req.body;

    // Find or create client
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          phone,
          role: 'CLIENT',
        },
      });
      
      await prisma.clientProfile.create({
        data: { userId: user.id },
      });
    }

    // Check for conflicts
    const appointmentDate = new Date(date);
    const endTime = new Date(appointmentDate);
    endTime.setMinutes(endTime.getMinutes() + 60);

    const conflict = await prisma.appointment.findFirst({
      where: {
        date: {
          lt: endTime,
          gt: { lt: appointmentDate },
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (conflict) {
      return res.status(409).json({ error: 'Time slot is no longer available' });
    }

    const appointment = await prisma.appointment.create({
      data: {
        clientId: user.id,
        date: appointmentDate,
        type,
        notes,
        depositAmount: depositAmount ? parseFloat(depositAmount) : null,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Send confirmation emails
    await Promise.all([
      transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Appointment Confirmation',
        html: `
          <h1>Appointment Confirmed</h1>
          <p>Dear ${firstName},</p>
          <p>Your consultation has been scheduled for:</p>
          <p><strong>${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}</strong></p>
          <p>Type: ${type}</p>
          ${depositAmount ? `<p>Deposit required: $${depositAmount}</p>` : ''}
        `,
      }),
      transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Appointment Booked',
        html: `
          <h1>New Appointment</h1>
          <p>Client: ${firstName} ${lastName}</p>
          <p>Email: ${email}</p>
          <p>Date: ${appointmentDate.toLocaleString()}</p>
          <p>Type: ${type}</p>
        `,
      }),
    ]);

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update appointment
router.put('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status, meetingLink, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status, meetingLink, notes },
      include: {
        client: {
          select: { email: true, firstName: true },
        },
      },
    });

    // Send status update email
    if (status === 'CONFIRMED') {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: appointment.client.email,
        subject: 'Appointment Confirmed',
        html: `
          <h1>Your Appointment is Confirmed</h1>
          <p>Dear ${appointment.client.firstName},</p>
          <p>Your appointment has been confirmed.</p>
          ${meetingLink ? `<p>Join here: <a href="${meetingLink}">${meetingLink}</a></p>` : ''}
        `,
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        client: {
          select: { email: true, firstName: true },
        },
      },
    });

    // Send cancellation email
    await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: appointment.client.email,
      subject: 'Appointment Cancelled',
      html: `
        <h1>Appointment Cancelled</h1>
        <p>Dear ${appointment.client.firstName},</p>
        <p>Your appointment has been cancelled.</p>
        ${reason ? `<p>Reason: ${reason}</p>` : ''}
        <p>Please contact us to reschedule.</p>
      `,
    });

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

export default router;
