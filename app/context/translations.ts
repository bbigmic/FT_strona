export const translations = {
  PL: {
    navbar: {
      start: "Start",
      services: "Usługi",
      products: "Produkty",
      about: "O nas",
      contact: "Kontakt",
      online: "ONLINE",
      system_ready: "SYSTEM_GOTOWY",
      nav_menu: "MENU_NAWIGACJI",
      system_ver: "SYSTEM_V.1.0",
    },
    hero: {
      available_for_hire: "DOSTĘPNY DO ZATRUDNIENIA",
      building_digital: "TWORZENIE CYFROWYCH",
      products_brands: "PRODUKTÓW, MAREK I DOŚWIADCZEŃ",
      latest_shots: "OSTATNIE REALIZACJE",
      headline_primary: "Inteligencja.",
      headline_secondary: "Zautomatyzowana."
      ,tagline: "Budujemy autonomiczne systemy, które pracują za Ciebie."
    },
    products: {
      available_solutions: "DOSTĘPNE ROZWIĄZANIA",
      our: "Nasze",
      products: "Produkty",
      subtitle: "Gotowe rozwiązania, które możesz wdrożyć w swojej firmie już dziś.",
      book_demo: "UMÓW_SIĘ_NA_DEMO",
      items: [
        {
          title: "AGENT_SPRZEDAŻY_AI_V2",
          description: "Autonomiczny agent sprzedażowy, który kwalifikuje leady i umawia spotkania 24/7.",
          features: ["Przetwarzanie NLP", "Integracja CRM", "Wsparcie wielokanałowe"]
        },
        {
          title: "EKSTRAKTOR_DANYCH_PRO",
          description: "Zaawansowany scraper danych. Pozyskuje kontakty biznesowe z LinkedIn i baz danych.",
          features: ["Zgodność z RODO", "Weryfikacja w czasie rzeczywistym", "Eksport do CSV/API"]
        },
        {
          title: "OCHRONA_SaaS",
          description: "Kompletna infrastruktura bezpieczeństwa dla Twojej aplikacji webowej.",
          features: ["Ochrona DDoS", "Auto-skalowanie", "Monitoring 24/7"]
        }
      ]
    },
    services: {
      title: "Możliwości Systemu",
      subtitle: "Modułowe rozwiązania zaprojektowane dla maksymalnej wydajności.",
      items: [
        {
          id: "AI_AGENTS",
          title: "AGENCI_AI",
          description: "Autonomiczne systemy wykonujące zadania 24/7. Twoja cyfrowa siła robocza.",
          details: {
            title: "Autonomiczni Agenci AI",
            content: "Wdrażamy zaawansowanych agentów AI, którzy przejmują powtarzalne zadania w Twojej firmie. Od obsługi klienta po analizę danych - nasze boty pracują 24/7 bez przerw, ucząc się i adaptując do nowych wyzwań.",
            features: ["Obsługa klienta 24/7", "Analiza sentymentu", "Automatyczna kwalifikacja leadów", "Wsparcie wielojęzyczne"]
          }
        },
        {
          id: "AUTOMATION",
          title: "AUTOMATYZACJA",
          description: "Integracja CRM, ERP i Email. Eliminacja zbędnej pracy.",
          details: {
            title: "Automatyzacja Procesów",
            content: "Łączymy Twoje systemy (CRM, ERP, Email) w jeden spójny ekosystem. Eliminujemy ręczne wprowadzanie danych i błędy ludzkie, oszczędzając setki godzin miesięcznie i pozwalając Twojemu zespołowi skupić się na tym, co ważne.",
            features: ["Integracje API", "Automatyzacja obiegu dokumentów", "Synchronizacja danych", "Raportowanie w czasie rzeczywistym"]
          }
        },
        {
          id: "SAAS_DEV",
          title: "ROZWÓJ_SaaS",
          description: "Skalowalne aplikacje w modelu subskrypcyjnym.",
          details: {
            title: "Budowa Aplikacji SaaS",
            content: "Projektujemy i budujemy skalowalne aplikacje webowe w modelu subskrypcyjnym. Od pomysłu po wdrożenie, zapewniamy technologię, która rośnie razem z Twoim biznesem i jest gotowa na przyjęcie tysięcy użytkowników.",
            features: ["Architektura Multi-tenant", "Systemy płatności (Stripe)", "Panel administracyjny", "Skalowalność w chmurze"]
          }
        },
        {
          id: "WEB_SYSTEMS",
          title: "SYSTEMY_WEB",
          description: "Szybkie, bezpieczne i nowoczesne strony www.",
          details: {
            title: "Nowoczesne Systemy Webowe",
            content: "Tworzymy szybkie, bezpieczne i responsywne strony oraz aplikacje internetowe. Wykorzystujemy najnowsze technologie (Next.js, React), aby zapewnić najwyższą jakość i doskonałe doświadczenia użytkownika.",
            features: ["SSR / SSG (Next.js)", "Optymalizacja SEO", "Responsywny Design (RWD)", "Wysoka wydajność (Core Web Vitals)"]
          }
        }
      ],
      integration: {
        badge: "INTEGRACJA_SYSTEMOWA",
        title: "Pełna kontrola nad danymi.",
        description: "Nasze systemy integrują się z Twoim obecnym stosem technologicznym. API, Webhooki, bazy danych - wszystko połączone w jeden spójny organizm.",
        resources: "ZASOBY",
        docs: "Dokumentacja Techniczna"
      },
      docs_modal: {
        title: "Dokumentacja Systemu v2.4.0",
        intro_title: "01_WSTĘP",
        intro_text: "System Architektury FelizTrade (SAF) to modułowa platforma sterowana zdarzeniami, zaprojektowana do przetwarzania danych o wysokiej przepustowości i automatycznego podejmowania decyzji.",
        api_title: "02_SPECYFIKACJA_API",
        integration_title: "03_PRZEWODNIK_INTEGRACJI",
        close: "Zamknij"
      },
      service_modal: {
        features_title: "Kluczowe funkcje:",
        interested: "JESTEM ZAINTERESOWANY",
        close: "ZAMKNIJ"
      },
      inquiry_form: {
        title: "PANEL_ZGŁOSZENIOWY",
        name_label: "IMIĘ_I_NAZWISKO",
        email_label: "EMAIL",
        phone_label: "TELEFON",
        company_label: "FIRMA",
        message_label: "SZCZEGÓŁY_ZLECENIA",
        submit: "WYŚLIJ_ZGŁOSZENIE",
        success_title: "ZGŁOSZENIE_PRZYJĘTE",
        success_msg: "Twój wniosek został zarejestrowany w systemie. Oczekuj kontaktu.",
        close: "ZAMKNIJ"
      }
    },
    booking: {
      system_title: "SYSTEM_REZERWACJI_V1.0",
      step_1_title: "WYBIERZ_DATĘ",
      step_1_time: "DOSTĘPNE_GODZINY",
      next: "DALEJ",
      step_2_title: "DANE_KONTAKTOWE",
      name_label: "IMIĘ_I_NAZWISKO",
      company_label: "FIRMA",
      email_label: "EMAIL",
      phone_label: "TELEFON",
      back: "WRÓĆ",
      submit: "ZATWIERDŹ",
      success_title: "REZERWACJA_POTWIERDZONA",
      success_msg: "Dziękujemy za umówienie spotkania. Potwierdzenie zostało wysłane na podany adres email.",
      meeting_date: "DATA_SPOTKANIA",
      close: "ZAMKNIJ"
    }
  },
  EN: {
    navbar: {
      start: "Home",
      services: "Services",
      products: "Products",
      about: "About",
      contact: "Contact",
      online: "ONLINE",
      system_ready: "SYSTEM_READY",
      nav_menu: "NAVIGATION_MENU",
      system_ver: "SYSTEM_V.1.0",
    },
    hero: {
      available_for_hire: "AVAILABLE FOR HIRE",
      building_digital: "BUILDING DIGITAL",
      products_brands: "PRODUCTS, BRANDS, AND EXPERIENCES",
      latest_shots: "LATEST SHOTS",
      headline_primary: "Intelligence.",
      headline_secondary: "Automated."
      ,tagline: "We build autonomous systems that work for you."
    },
    products: {
      available_solutions: "AVAILABLE SOLUTIONS",
      our: "Our",
      products: "Products",
      subtitle: "Ready-made solutions you can implement in your company today.",
      book_demo: "BOOK_A_DEMO",
      items: [
        {
          title: "AI_SALES_AGENT_V2",
          description: "Autonomous sales agent that qualifies leads and books appointments 24/7.",
          features: ["NLP Processing", "CRM Integration", "Multi-channel Support"]
        },
        {
          title: "DATA_MINER_PRO",
          description: "Advanced data scraper. Acquires business contacts from LinkedIn and databases.",
          features: ["GDPR Compliant", "Real-time Verification", "Export to CSV/API"]
        },
        {
          title: "SECURE_GUARD_SaaS",
          description: "Complete security infrastructure for your web application.",
          features: ["DDoS Protection", "Auto-scaling", "24/7 Monitoring"]
        }
      ]
    },
    services: {
      title: "System Capabilities",
      subtitle: "Modular solutions designed for maximum performance.",
      items: [
        {
          id: "AI_AGENTS",
          title: "AI_AGENTS",
          description: "Autonomous systems performing tasks 24/7. Your digital workforce.",
          details: {
            title: "Autonomous AI Agents",
            content: "We implement advanced AI agents that take over repetitive tasks in your company. From customer service to data analysis - our bots work 24/7 without breaks, learning and adapting to new challenges.",
            features: ["24/7 Customer Support", "Sentiment Analysis", "Auto Lead Qualification", "Multi-language Support"]
          }
        },
        {
          id: "AUTOMATION",
          title: "AUTOMATION",
          description: "CRM, ERP and Email integration. Eliminating redundant work.",
          details: {
            title: "Process Automation",
            content: "We connect your systems (CRM, ERP, Email) into one coherent ecosystem. We eliminate manual data entry and human errors, saving hundreds of hours monthly and allowing your team to focus on what matters.",
            features: ["API Integrations", "Document Workflow Automation", "Data Synchronization", "Real-time Reporting"]
          }
        },
        {
          id: "SAAS_DEV",
          title: "SAAS_DEV",
          description: "Scalable subscription-based applications.",
          details: {
            title: "SaaS Application Development",
            content: "We design and build scalable web applications in a subscription model. From idea to deployment, we provide technology that grows with your business and is ready to handle thousands of users.",
            features: ["Multi-tenant Architecture", "Payment Systems (Stripe)", "Admin Panel", "Cloud Scalability"]
          }
        },
        {
          id: "WEB_SYSTEMS",
          title: "WEB_SYSTEMS",
          description: "Fast, secure and modern websites.",
          details: {
            title: "Modern Web Systems",
            content: "We create fast, secure and responsive websites and web applications. We use the latest technologies (Next.js, React) to ensure the highest quality and excellent user experience.",
            features: ["SSR / SSG (Next.js)", "SEO Optimization", "Responsive Design (RWD)", "High Performance (Core Web Vitals)"]
          }
        }
      ],
      integration: {
        badge: "SYSTEM_INTEGRATION",
        title: "Full control over data.",
        description: "Our systems integrate with your current tech stack. APIs, Webhooks, databases - all connected into one coherent organism.",
        resources: "RESOURCES",
        docs: "Technical Documentation"
      },
      docs_modal: {
        title: "System Documentation v2.4.0",
        intro_title: "01_INTRODUCTION",
        intro_text: "FelizTrade Architecture System (FAS) is a modular, event-driven platform designed for high-throughput data processing and automated decision making.",
        api_title: "02_API_SPECIFICATION",
        integration_title: "03_INTEGRATION_GUIDE",
        close: "Close"
      },
      service_modal: {
        features_title: "Key features:",
        interested: "I AM INTERESTED",
        close: "CLOSE"
      },
      inquiry_form: {
        title: "INQUIRY_PANEL",
        name_label: "FULL_NAME",
        email_label: "EMAIL",
        phone_label: "PHONE",
        company_label: "COMPANY",
        message_label: "ORDER_DETAILS",
        submit: "SEND_INQUIRY",
        success_title: "INQUIRY_ACCEPTED",
        success_msg: "Your request has been registered in the system. Await contact.",
        close: "CLOSE"
      }
    },
    booking: {
      system_title: "BOOKING_SYSTEM_V1.0",
      step_1_title: "SELECT_DATE",
      step_1_time: "AVAILABLE_TIMES",
      next: "NEXT",
      step_2_title: "CONTACT_DETAILS",
      name_label: "FULL_NAME",
      company_label: "COMPANY",
      email_label: "EMAIL",
      phone_label: "PHONE",
      back: "BACK",
      submit: "SUBMIT",
      success_title: "BOOKING_CONFIRMED",
      success_msg: "Thank you for booking a meeting. Confirmation has been sent to your email address.",
      meeting_date: "MEETING_DATE",
      close: "CLOSE"
    }
  }
};

export type Language = keyof typeof translations;
export type Translations = typeof translations.PL;
