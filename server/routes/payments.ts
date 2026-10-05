import { Router } from 'express';
import { prisma } from '../prisma.js';
import Stripe from 'stripe';
import { authenticate, AuthRequest, requireRole } from '../middleware/auth';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });

// Create payment intent for consultation deposit
router.post('/create-consultation-payment', async (req, res) => {
  try {
    const { amount, appointmentId, email } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        appointmentId,
        type: 'consultation_deposit',
      },
      receipt_email: email,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Create invoice
router.post('/create-invoice', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { clientId, amount, description, dueDate } = req.body;

    const client = await prisma.user.findUnique({
      where: { id: clientId },
      include: { clientProfile: true },
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Create Stripe invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: client.clientProfile?.stripeCustomerId || await createStripeCustomer(client),
      amount: Math.round(parseFloat(amount) * 100),
      currency: 'usd',
      description,
    });

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: invoiceItem.customer as string,
      auto_advance: true,
      due_date: Math.floor(new Date(dueDate).getTime() / 1000),
    });

    // Save to database
    const paymentRecord = await prisma.payment.create({
      data: {
        clientId,
        amount: parseFloat(amount),
        description,
        status: 'PENDING',
        stripeId: invoice.id,
        dueDate: new Date(dueDate),
      },
    });

    res.json({ invoice, payment: paymentRecord });
  } catch (error) {
    console.error('Invoice creation error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
});

// Get client's payments
router.get('/my-payments', authenticate, requireRole('CLIENT'), async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { clientId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

// Get all payments (admin)
router.get('/', authenticate, requireRole('ADMIN'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    const where: any = {};
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      payments,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

// Stripe webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret!);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      await handleInvoicePayment(invoice);
      break;
    
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      await handlePaymentFailure(failedInvoice);
      break;
  }

  res.json({ received: true });
});

// Helper functions
async function createStripeCustomer(client: any) {
  const customer = await stripe.customers.create({
    email: client.email,
    name: `${client.firstName} ${client.lastName}`,
  });

  await prisma.clientProfile.update({
    where: { userId: client.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { appointmentId, type } = paymentIntent.metadata;

  if (type === 'consultation_deposit' && appointmentId) {
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { depositPaid: true },
    });
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice) {
  await prisma.payment.updateMany({
    where: { stripeId: invoice.id },
    data: { 
      status: 'PAID',
      paidAt: new Date(),
    },
  });
}

async function handlePaymentFailure(invoice: Stripe.Invoice) {
  await prisma.payment.updateMany({
    where: { stripeId: invoice.id },
    data: { status: 'OVERDUE' },
  });
}

export default router;
