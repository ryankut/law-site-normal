export * from './practice';
export * from './attorney';
export * from './content';
export * from './contact';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface NavLink {
    name: string;
    href: string;
}
