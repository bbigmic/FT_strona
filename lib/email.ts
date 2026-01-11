import nodemailer from 'nodemailer';

// Konfiguracja transporter SMTP
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 's134.cyber-folks.pl';
  const port = parseInt(process.env.SMTP_PORT || '465');
  const user = process.env.SMTP_USER || '';
  const pass = process.env.SMTP_PASSWORD || '';

  // Debug logowanie (bez hasła)
  console.log('SMTP Config:', { host, port, user, hasPassword: !!pass });

  if (!user || !pass) {
    throw new Error('SMTP credentials are missing. Please set SMTP_USER and SMTP_PASSWORD in .env.local');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: true, // true dla portu 465
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false, // Niektóre serwery wymagają tego
    },
  });
};

// Szablon emaila dla klienta - Formularz kontaktowy
export const sendContactConfirmationEmail = async (to: string, name: string) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Feliz Trade Ltd" <automatizations@feliztradeltd.com>`,
    to: to,
    subject: 'Dziękujemy za kontakt - Feliz Trade Ltd',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #22c55e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FELIZ TRADE LTD</h1>
            </div>
            <div class="content">
              <h2>Dziękujemy za kontakt, ${name}!</h2>
              <p>Otrzymaliśmy Twoje zgłoszenie i skontaktujemy się z Tobą w ciągu 24 godzin.</p>
              <p>Nasz zespół przeanalizuje Twoje zapytanie i przygotuje odpowiedź.</p>
              <p>Jeśli masz pilne pytania, możesz skontaktować się z nami bezpośrednio:</p>
              <ul>
                <li>Email: contact@feliztradeltd.com</li>
                <li>Telefon: +48 123 456 789</li>
              </ul>
              <p>Pozdrawiamy,<br>Zespół Feliz Trade Ltd</p>
            </div>
            <div class="footer">
              <p>To jest automatyczna wiadomość. Prosimy nie odpowiadać na ten email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Szablon emaila dla klienta - Zapytanie o usługę
export const sendServiceInquiryConfirmationEmail = async (
  to: string,
  name: string,
  company: string,
  product: string
) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Feliz Trade Ltd" <automatizations@feliztradeltd.com>`,
    to: to,
    subject: `Zapytanie o ${product} - Potwierdzenie otrzymania`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #22c55e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .product-box { background: #fff; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FELIZ TRADE LTD</h1>
            </div>
            <div class="content">
              <h2>Dziękujemy za zapytanie, ${name}!</h2>
              <p>Otrzymaliśmy Twoje zapytanie dotyczące usługi:</p>
              <div class="product-box">
                <strong>${product}</strong>
              </div>
              <p>Nasz zespół przeanalizuje Twoje potrzeby i przygotuje spersonalizowaną ofertę.</p>
              <p>Skontaktujemy się z Tobą w ciągu 24-48 godzin.</p>
              <p>Firma: <strong>${company}</strong></p>
              <p>Jeśli masz pilne pytania, możesz skontaktować się z nami bezpośrednio:</p>
              <ul>
                <li>Email: contact@feliztradeltd.com</li>
                <li>Telefon: +48 123 456 789</li>
              </ul>
              <p>Pozdrawiamy,<br>Zespół Feliz Trade Ltd</p>
            </div>
            <div class="footer">
              <p>To jest automatyczna wiadomość. Prosimy nie odpowiadać na ten email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending service inquiry confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Szablon emaila dla klienta - Rezerwacja demo
export const sendDemoBookingConfirmationEmail = async (
  to: string,
  name: string,
  company: string,
  date: string,
  time: string,
  product: string
) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Feliz Trade Ltd" <automatizations@feliztradeltd.com>`,
    to: to,
    subject: 'Potwierdzenie rezerwacji demo - Feliz Trade Ltd',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #22c55e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .booking-box { background: #fff; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
            .booking-date { font-size: 24px; font-weight: bold; color: #22c55e; }
            .booking-time { font-size: 20px; color: #666; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>FELIZ TRADE LTD</h1>
            </div>
            <div class="content">
              <h2>Rezerwacja potwierdzona, ${name}!</h2>
              <p>Twoja rezerwacja demo została pomyślnie zarejestrowana.</p>
              <div class="booking-box">
                <div class="booking-date">${date}</div>
                <div class="booking-time">${time}</div>
                <p style="margin-top: 15px; color: #666;">Produkt: <strong>${product}</strong></p>
              </div>
              <p>Firma: <strong>${company}</strong></p>
              <p>W ciągu najbliższych godzin skontaktujemy się z Tobą, aby potwierdzić szczegóły spotkania.</p>
              <p>Jeśli potrzebujesz zmienić termin, prosimy o kontakt:</p>
              <ul>
                <li>Email: contact@feliztradeltd.com</li>
                <li>Telefon: +48 123 456 789</li>
              </ul>
              <p>Pozdrawiamy,<br>Zespół Feliz Trade Ltd</p>
            </div>
            <div class="footer">
              <p>To jest automatyczna wiadomość. Prosimy nie odpowiadać na ten email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending demo booking confirmation email:', error);
    return { success: false, error: error.message };
  }
};

// Email powiadomienia dla nas (automatizations@feliztradeltd.com)
export const sendNotificationEmail = async (
  source: string,
  leadData: {
    name: string;
    contact: string;
    email: string;
    phone: string;
    company: string;
    details?: string;
    product?: string;
    date?: string;
    time?: string;
  }
) => {
  const transporter = createTransporter();
  
  const sourceLabels: { [key: string]: string } = {
    'KONTAKT': 'Formularz kontaktowy',
    'USŁUGI': 'Zapytanie o usługę',
    'DEMO': 'Rezerwacja demo',
  };

  const mailOptions = {
    from: `"Feliz Trade System" <automatizations@feliztradeltd.com>`,
    to: 'automatizations@feliztradeltd.com',
    subject: `Nowy lead: ${sourceLabels[source] || source} - ${leadData.company}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #22c55e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .info-box { background: #fff; border-left: 4px solid #22c55e; padding: 15px; margin: 10px 0; }
            .label { font-weight: bold; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>NOWY LEAD</h1>
            </div>
            <div class="content">
              <h2>${sourceLabels[source] || source}</h2>
              <div class="info-box">
                <p><span class="label">Firma:</span> ${leadData.company}</p>
                <p><span class="label">Kontakt:</span> ${leadData.contact}</p>
                <p><span class="label">Email:</span> ${leadData.email}</p>
                <p><span class="label">Telefon:</span> ${leadData.phone}</p>
                ${leadData.product ? `<p><span class="label">Produkt:</span> ${leadData.product}</p>` : ''}
                ${leadData.date && leadData.time ? `<p><span class="label">Termin:</span> ${leadData.date} o ${leadData.time}</p>` : ''}
                ${leadData.details ? `<p><span class="label">Szczegóły:</span><br>${leadData.details.replace(/\n/g, '<br>')}</p>` : ''}
              </div>
              <p style="margin-top: 20px; color: #666; font-size: 12px;">
                Lead został automatycznie zapisany w systemie CRM.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Error sending notification email:', error);
    return { success: false, error: error.message };
  }
};

