'use server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

export async function subscribeAction(prevState: any, formData: FormData) {
  console.log("SERVER ACTION TRIGGERED", Object.fromEntries(formData));
  const email = formData.get('email');

  if (!email || typeof email !== 'string') {
    console.log("Validation failed: no valid email");
    return { error: 'Please provide a valid email address.' };
  }

  console.log("Sending email to Strapi:", email);


  try {
    const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          email: email,
        },
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      // Check for uniqueness error
      if (errorData?.error?.message?.toLowerCase().includes('unique')) {
        return { error: 'This email is already subscribed!' };
      }
      console.error('Strapi error:', errorData);
      return { error: 'Failed to subscribe. Please try again.' };
    }

    return { success: true, message: 'Thanks for subscribing!' };
  } catch (err) {
    console.error('Subscription error:', err);
    return { error: 'Something went wrong. Please try again later.' };
  }
}
