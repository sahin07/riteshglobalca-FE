export interface BlogPostContentBlock {
  type: 'paragraph' | 'heading' | 'list' | 'callout' | 'image';
  text?: string;
  level?: 1 | 2 | 3;
  listType?: 'bullet' | 'number';
  items?: string[];
  calloutType?: 'info' | 'warning';
  src?: string;
  caption?: string;
}

export interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  tags: string[];
  tableOfContents: { id: string; label: string; subitems?: { id: string; label: string }[] }[];
  content: BlogPostContentBlock[];
  relatedPostsSlugs: string[];
  comments: Comment[];
}

export const mockPosts: Record<string, BlogPost> = {
  'complete-gst-guide-for-small-businesses-in-2025': {
    slug: 'complete-gst-guide-for-small-businesses-in-2025',
    title: 'Complete Guide to GST Compliance for Small Businesses in 2025',
    category: 'Expert Advice',
    date: 'Nov 25, 2025',
    image: '/images/blog/gst_compliance_banner.png',
    excerpt: 'Navigating GST compliance can be overwhelming for small business owners. With constantly evolving regulations and stringent deadlines, understanding your obligations is crucial to avoid penalties and maintain smooth operations.',
    tags: ['GST', 'Income tax', 'Filing', 'Compliance', 'Small Business'],
    tableOfContents: [
      {
        id: 'understanding-gst-basics',
        label: 'Understanding GST Basics',
        subitems: [{ id: 'key-gst-components', label: 'Key GST Components' }]
      },
      {
        id: 'registration-process',
        label: 'Registration Process',
        subitems: [{ id: 'required-documents', label: 'Required Documents' }]
      },
      {
        id: 'filing-requirements-and-deadlines',
        label: 'Filing Requirements and Deadlines',
        subitems: [{ id: 'common-return-types', label: 'Common Return Types' }]
      },
      {
        id: 'common-compliance-mistakes',
        label: 'Common Compliance Mistakes'
      },
      {
        id: 'best-practices-for-small-businesses',
        label: 'Best Practices for Small Businesses'
      }
    ],
    content: [
      {
        type: 'paragraph',
        text: 'Navigating GST compliance can be overwhelming for small business owners. With constantly evolving regulations and stringent deadlines, understanding your obligations is crucial to avoid penalties and maintain smooth operations.'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Understanding GST Basics'
      },
      {
        type: 'paragraph',
        text: 'GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services. It replaced multiple indirect taxes and created a unified tax structure across India. For small businesses, proper GST registration and compliance are mandatory once your turnover exceeds the threshold limit.'
      },
      {
        type: 'callout',
        calloutType: 'info',
        text: 'As of 2025, businesses with an annual turnover exceeding ₹40 lakhs (₹20 lakhs for special category states) must register for GST.'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Key GST Components'
      },
      {
        type: 'list',
        listType: 'bullet',
        items: [
          'CGST (Central Goods and Services Tax)',
          'SGST (State Goods and Services Tax)',
          'IGST (Integrated Goods and Services Tax)',
          'UTGST (Union Territory Goods and Services Tax)'
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: 'Registration Process'
      },
      {
        type: 'paragraph',
        text: 'Getting your GST registration right is the first step. The process involves submitting documents online through the GST portal, verification, and receiving your GSTIN (GST Identification Number).'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Required Documents'
      },
      {
        type: 'list',
        listType: 'number',
        items: [
          'PAN card of the business',
          'Aadhaar card of the promoters/directors',
          'Proof of business registration',
          'Bank account statement or cancelled cheque',
          'Address proof of the place of business',
          'Digital signature (for companies)'
        ]
      },
      {
        type: 'image',
        src: '/images/blog/gst_registration_form.png',
        caption: 'Essential documents required for GST registration'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Filing Requirements and Deadlines'
      },
      {
        type: 'paragraph',
        text: 'Regular and timely filing is essential to avoid penalties. Small businesses typically need to file monthly or quarterly returns depending on their turnover and scheme opted.'
      },
      {
        type: 'callout',
        calloutType: 'warning',
        text: 'Late filing of GST returns can result in penalties of ₹50 per day (₹20 per day for nil returns) under CGST and SGST, totaling ₹100 per day. The maximum penalty is capped at ₹5,000.'
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common Return Types'
      },
      {
        type: 'list',
        listType: 'number',
        items: [
          'GSTR-1: Details of outward supplies',
          'GSTR-3B: Summary return with tax payment',
          'GSTR-9: Annual return',
          'GSTR-4: Quarterly return for composition scheme taxpayers'
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: 'Common Compliance Mistakes'
      },
      {
        type: 'paragraph',
        text: 'Even experienced business owners make mistakes. Here are the most common pitfalls and how to avoid them:'
      },
      {
        type: 'list',
        listType: 'number',
        items: [
          'Incorrect invoice formatting - Ensure all mandatory fields are included',
          'Mismatched ITC claims - Reconcile purchases with supplier filings',
          'Missing the reverse charge mechanism - Know when it applies',
          'Improper classification of goods/services - Use the correct HSN/SAC codes'
        ]
      },
      {
        type: 'heading',
        level: 2,
        text: 'Best Practices for Small Businesses'
      },
      {
        type: 'paragraph',
        text: 'Implementing these best practices will streamline your GST compliance and reduce errors:'
      },
      {
        type: 'list',
        listType: 'bullet',
        items: [
          'Maintain digital records of all transactions',
          'Reconcile your books monthly, not quarterly',
          'Use GST-compliant accounting software',
          'Set up calendar reminders for all filing deadlines',
          'Regularly verify your GSTIN status and vendor credentials'
        ]
      },
      {
        type: 'callout',
        calloutType: 'info',
        text: 'Consider hiring a qualified CA or tax professional if your business transactions are complex or if you’re dealing with interstate supplies regularly.'
      },
      {
        type: 'paragraph',
        text: 'Staying compliant with GST regulations doesn’t have to be stressful. With proper planning, regular monitoring, and the right tools, you can ensure smooth operations while focusing on growing your business.'
      }
    ],
    relatedPostsSlugs: [
      'how-we-helped-a-retail-brand-increase-sales-by-45',
      'from-startup-to-scale-a-tech-companys-growth-journey'
    ],
    comments: [
      {
        id: 1,
        author: 'Rajesh Kumar',
        date: 'May 20, 2025',
        content: 'Very helpful article! I was confused about the quarterly filing deadlines, but this cleared everything up. Thank you!'
      },
      {
        id: 2,
        author: 'Anita Desai',
        date: 'May 20, 2025',
        content: 'As a small business owner, GST compliance has always been overwhelming. This guide breaks it down perfectly. Bookmarking this for future reference!'
      }
    ]
  },
  // Placeholders for related posts to avoid errors and support rendering
  'how-we-helped-a-retail-brand-increase-sales-by-45': {
    slug: 'how-we-helped-a-retail-brand-increase-sales-by-45',
    title: 'How We Helped a Retail Brand Increase Sales by 45%',
    category: 'Success Story',
    date: 'November 19, 2025',
    image: '/images/blog/retail_success.png',
    excerpt: 'AI, automation, and shifting consumer behavior are shaping industries. Stay ahead with these key trends for 2024.',
    tags: [],
    tableOfContents: [],
    content: [],
    relatedPostsSlugs: [],
    comments: []
  },
  'from-startup-to-scale-a-tech-companys-growth-journey': {
    slug: 'from-startup-to-scale-a-tech-companys-growth-journey',
    title: 'From Startup to Scale: A Tech Company’s Growth Journey',
    category: 'Success Story',
    date: 'November 03, 2025',
    image: '/images/blog/startup_scale.png',
    excerpt: 'Discover how one company navigated rapid growth, scaled operations, and stayed true to its vision.',
    tags: [],
    tableOfContents: [],
    content: [],
    relatedPostsSlugs: [],
    comments: []
  }
};

export function getPostBySlug(slug: string): BlogPost | undefined {
  return mockPosts[slug];
}
