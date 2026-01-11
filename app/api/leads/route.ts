import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  sendContactConfirmationEmail,
  sendServiceInquiryConfirmationEmail,
  sendDemoBookingConfirmationEmail,
  sendNotificationEmail,
} from '@/lib/email';

// POST - Utwórz nowego leada z formularza
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mapowanie danych z aplikacji do formatu bazy
    const leadData = {
      name: body.name,
      contact: body.contact || body.name,
      email: body.email,
      phone: body.phone,
      company: body.company || body.name,
      source: body.source, // KONTAKT, USŁUGI, DEMO
      status: 'NOWY', // Zawsze NOWY dla nowych leadów
      value: body.value || 'Do wyceny',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      details: body.details || body.message || '',
      call_details: body.callDetails || 'Oczekuje na kontakt',
      product: body.product || null,
    };

    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead', details: error.message },
        { status: 500 }
      );
    }

    // Wysyłanie emaili (w tle, nie blokujemy odpowiedzi)
    Promise.all([
      // Email do klienta
      (async () => {
        try {
          if (body.source === 'KONTAKT') {
            await sendContactConfirmationEmail(body.email, body.contact || body.name);
          } else if (body.source === 'USŁUGI') {
            await sendServiceInquiryConfirmationEmail(
              body.email,
              body.contact || body.name,
              body.company || body.name,
              body.product || 'Usługa'
            );
          } else if (body.source === 'DEMO') {
            // Parsowanie daty z details
            const dateMatch = leadData.details?.match(/Rezerwacja: (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2})/);
            const demoDate = dateMatch ? dateMatch[1] : leadData.date;
            const demoTime = dateMatch ? dateMatch[2] : leadData.time;
            
            await sendDemoBookingConfirmationEmail(
              body.email,
              body.contact || body.name,
              body.company || body.name,
              demoDate,
              demoTime,
              body.product || 'Demo'
            );
          }
        } catch (emailError) {
          console.error('Error sending confirmation email to client:', emailError);
        }
      })(),
      // Email powiadomienia dla nas
      (async () => {
        try {
          await sendNotificationEmail(body.source, {
            name: leadData.name,
            contact: leadData.contact,
            email: leadData.email,
            phone: leadData.phone,
            company: leadData.company,
            details: leadData.details,
            product: leadData.product || undefined,
            date: leadData.date,
            time: leadData.time,
          });
        } catch (emailError) {
          console.error('Error sending notification email:', emailError);
        }
      })(),
    ]).catch((err) => {
      console.error('Error in email sending:', err);
    });

    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

