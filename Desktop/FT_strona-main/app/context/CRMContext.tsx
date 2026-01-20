"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Lead = {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  status: string;
  value: string;
  date: string;
  time: string;
  details: string;
  callDetails: string;
  transcription?: { role: string; text: string }[];
  aiSummary?: string;
  product?: string;
  assignedEmployee?: string;
  clientNote?: string;
  projectChanges?: string;
  productTasks?: ProductTask[];
  finalDeadline?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
  rejectionReason?: string;
  nip?: string;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
  items: { description: string; quantity: number; unitPrice: number; vatRate: number; total: number }[];
};

export type InvoiceTemplate = {
  id: string;
  name: string;
  items: { description: string; quantity: string; unitPrice: string; vatRate: string }[];
};

export type ClientProgram = {
  id: string;
  name: string;
  login?: string;
  password?: string;
  url?: string;
  notes?: string;
};

export type Client = Lead & {
  clientSince: string;
  invoices?: Invoice[];
  invoiceTemplates?: InvoiceTemplate[];
  programs?: ClientProgram[];
  type: "POTENTIAL" | "CUSTOMER";
  activeServices?: string[];
};

export type CalendarNote = {
  id: string;
  date: string;
  content: string;
};

export type ExpenseCategory = "Subskrypcje" | "Wyjazd" | "Delegacja" | "Utrzymanie programu" | "Tokeny AI" | "Inne";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  currency: string;
  category: ExpenseCategory;
  date: string;
  user: string;
};

interface CRMContextType {
  leads: Lead[];
  clients: Client[];
  employees: string[];
  projects: Project[];
  calendarNotes: CalendarNote[];
  expenses: Expense[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setCalendarNotes: React.Dispatch<React.SetStateAction<CalendarNote[]>>;
  moveLeadToClients: (leadId: number, assignedEmployee?: string) => void;
  addLead: (lead: Omit<Lead, "id" | "status" | "date" | "time">) => void;
  addClient: (client: Omit<Client, "id" | "status" | "date" | "time" | "clientSince">) => void;
  deleteLead: (leadId: number) => void;
  assignEmployee: (leadId: number, employee: string) => void;
  updateLead: (leadId: number, updates: Partial<Lead>) => void;
  updateClient: (clientId: number, updates: Partial<Client>) => void;
  addClientTask: (clientId: number, task: Omit<ProductTask, "id">) => void;
  updateClientTask: (clientId: number, taskId: number, updates: Partial<ProductTask>) => void;
  deleteClientTask: (clientId: number, taskId: number) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (projectId: number, updates: Partial<Project>) => void;
  moveClientToProject: (clientId: number) => void;
  addCalendarNote: (note: Omit<CalendarNote, "id">) => void;
  deleteCalendarNote: (noteId: string) => void;
  addInvoice: (clientId: number, invoice: Omit<Invoice, "id">) => void;
  updateInvoice: (clientId: number, invoiceId: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (clientId: number, invoiceId: string) => void;
  addClientProgram: (clientId: number, program: Omit<ClientProgram, "id">) => void;
  updateClientProgram: (clientId: number, programId: string, updates: Partial<ClientProgram>) => void;
  deleteClientProgram: (clientId: number, programId: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (expenseId: string) => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export function CRMProvider({ children }: { children: ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: "TechCorp Sp. z o.o.",
      contact: "Jan Kowalski",
      email: "jan@techcorp.pl",
      phone: "+48 123 456 789",
      company: "TechCorp Sp. z o.o.",
      source: "KONTAKT",
      status: "NOWY",
      value: "15,000 PLN",
      priority: "HIGH",
      date: "2024-01-15",
      time: "14:30",
      assignedEmployee: "Jan Kowalski",
      details: "Brak dodatkowych informacji",
      callDetails: "Klient pytał o cennik wdrożenia"
    },
    {
      id: 2,
      name: "StartUp Studio",
      contact: "Anna Nowak",
      email: "anna@startup.io",
      phone: "+48 987 654 321",
      company: "StartUp Studio",
      source: "DEMO",
      status: "POŁĄCZENIE ZAKOŃCZONE",
      value: "8,500 PLN",
      priority: "MEDIUM",
      date: "2026-01-07",
      time: "10:15",
      assignedEmployee: "Jan Kowalski",
      product: "System CRM",
      details: "Rezerwacja: 2026-01-08, 14:30",
      callDetails: "Umówiono spotkanie na przyszły tydzień",
      transcription: [
        { role: "ai", text: "Witamy w Feliz Trade. Czy dzwoni Pani w sprawie umówionego demo?" },
        { role: "user", text: "Tak, ale muszę przełożyć termin." },
        { role: "ai", text: "Nie ma problemu. Jaki termin Panią interesuje?" },
        { role: "user", text: "Przyszły tydzień, wtorek o 14:30." },
        { role: "ai", text: "Zapisane. Wtorek, 14:30. Do usłyszenia." }
      ],
      aiSummary: "Przełożenie terminu demo na przyszły wtorek 14:30."
    },
    {
      id: 3,
      name: "Global Solutions",
      contact: "Piotr Zieliński",
      email: "piotr@globals.com",
      phone: "+48 555 666 777",
      company: "Global Solutions",
      source: "USŁUGI",
      status: "NOWY",
      value: "45,000 PLN",
      priority: "HIGH",
      date: "2024-01-10",
      time: "16:45",
      details: "Wiadomość: Interesuje nas wdrożenie agentów AI dla działu obsługi klienta.",
      callDetails: "Wstępna analiza potrzeb",
      transcription: [
        { role: "ai", text: "Dzień dobry, dzwonię w odpowiedzi na zgłoszenie dotyczące agentów AI." },
        { role: "user", text: "Tak, chcemy zautomatyzować obsługę klienta." },
        { role: "ai", text: "Świetnie. Jakie kanały obsługujecie obecnie?" },
        { role: "user", text: "Głównie email i telefon." }
      ],
      aiSummary: "Klient szuka automatyzacji obsługi klienta (email + telefon). Wymaga głębszej analizy technicznej.",
      product: "Agenci AI"
    },
    {
      id: 4,
      name: "Local Shop",
      contact: "Marek Wójcik",
      email: "marek@shop.pl",
      phone: "+48 111 222 333",
      company: "Local Shop",
      source: "KONTAKT",
      status: "POŁĄCZENIE ZAKOŃCZONE",
      value: "5,000 PLN",
      date: "2024-01-05",
      time: "09:00",
      details: "Brak dodatkowych informacji",
      callDetails: "Klient zrezygnował z oferty",
      transcription: [
        { role: "ai", text: "Dzień dobry. Czy miał Pan okazję zapoznać się z naszą ofertą?" },
        { role: "user", text: "Tak, ale na razie rezygnuję. Za drogo." },
        { role: "ai", text: "Rozumiem. Dziękuję za informację. Jeśli zmienisz zdanie, zapraszamy." }
      ],
      aiSummary: "Klient odrzucił ofertę z powodu ceny. Status: Zakończone."
    },
    {
      id: 5,
      name: "E-Commerce Plus",
      contact: "Katarzyna Wiśniewska",
      email: "katarzyna@ecommerce-plus.pl",
      phone: "+48 600 700 800",
      company: "E-Commerce Plus",
      source: "USŁUGI",
      status: "NOWY",
      value: "12,000 PLN",
      date: "2024-01-18",
      time: "11:00",
      details: "Wiadomość: Potrzebujemy integracji z systemem magazynowym.",
      callDetails: "Oczekuje na wycenę",
      product: "Automatyzacja"
    },
    {
      id: 6,
      name: "Kancelaria Prawna Lex",
      contact: "Adam Nowicki",
      email: "adam@lex.pl",
      phone: "+48 501 502 503",
      company: "Kancelaria Prawna Lex",
      source: "KONTAKT",
      status: "POŁĄCZENIE ZAKOŃCZONE",
      value: "2,500 PLN",
      date: "2024-01-19",
      time: "15:20",
      details: "Zapytanie o audyt RODO.",
      callDetails: "Przesłano ofertę mailem",
      transcription: [
        { role: "ai", text: "Dzień dobry, czy mogę pomóc w kwestiach prawnych?" },
        { role: "user", text: "Tak, potrzebujemy audytu RODO dla nowej strony." },
        { role: "ai", text: "Jasne. Czy strona przetwarza dane wrażliwe?" },
        { role: "user", text: "Nie, tylko podstawowe dane kontaktowe." }
      ],
      aiSummary: "Zainteresowanie audytem RODO. Klient otrzymał ofertę."
    },
    {
      id: 7,
      name: "Logistyka 24",
      contact: "Tomasz Kot",
      email: "tomasz@logistyka24.pl",
      phone: "+48 777 888 999",
      company: "Logistyka 24",
      source: "DEMO",
      status: "NOWY",
      value: "25,000 PLN",
      date: "2026-01-07",
      time: "10:00",
      details: "Rezerwacja: 2026-01-09, 10:00",
      callDetails: "Potwierdzono termin demo",
      transcription: [
         { role: "ai", text: "Dzień dobry, dzwonię potwierdzić demo systemu." },
         { role: "user", text: "Tak, potwierdzam. Będę dostępny." }
      ],
      aiSummary: "Potwierdzenie terminu demo."
    },
    {
      id: 8,
      name: "Green Energy",
      contact: "Monika Zając",
      email: "monika@greenenergy.com",
      phone: "+48 666 555 444",
      company: "Green Energy",
      source: "USŁUGI",
      status: "POŁĄCZENIE ZAKOŃCZONE",
      value: "60,000 PLN",
      date: "2024-01-21",
      time: "13:45",
      details: "Wiadomość: Interesuje nas pełna automatyzacja procesów sprzedażowych.",
      callDetails: "Wymagane spotkanie z zarządem",
      product: "Systemy Dedykowane"
    },
    {
      id: 9,
      name: "Innovate Soft",
      contact: "Michał Kaczmarek",
      email: "michal@innovatesoft.pl",
      phone: "+48 500 600 700",
      company: "Innovate Soft",
      source: "DEMO",
      status: "NOWY",
      value: "18,000 PLN",
      date: "2026-01-07",
      time: "09:30",
      details: "Rezerwacja: 2026-01-07, 11:00",
      callDetails: "Klient prosił o przygotowanie scenariusza dla e-commerce",
      transcription: [
        { role: "ai", text: "Dzień dobry, potwierdzam rezerwację demo." },
        { role: "user", text: "Super, proszę tylko skupić się na funkcjach dla sklepów internetowych." },
        { role: "ai", text: "Zrozumiałem, przygotujemy odpowiedni scenariusz." }
      ],
      aiSummary: "Potwierdzono demo. Klient wymaga skupienia się na e-commerce."
    },
    {
      id: 10,
      name: "Marketing Pro",
      contact: "Ewa Dąbrowska",
      email: "ewa@marketingpro.pl",
      phone: "+48 601 701 801",
      company: "Marketing Pro",
      source: "DEMO",
      status: "POŁĄCZENIE ZAKOŃCZONE",
      value: "9,000 PLN",
      date: "2026-01-07",
      time: "12:15",
      details: "Rezerwacja: 2026-01-10, 13:00",
      callDetails: "Demo przełożone na prośbę klienta",
      transcription: [
        { role: "ai", text: "Dzień dobry, dzwonię w sprawie jutrzejszego demo." },
        { role: "user", text: "Niestety coś mi wypadło, czy możemy przełożyć?" },
        { role: "ai", text: "Oczywiście, jaki termin pasuje?" }
      ],
      aiSummary: "Klient przełożył demo. Nowy termin do ustalenia."
    },
    {
      id: 11,
      name: "FinTech Group",
      contact: "Robert Lewandowski",
      email: "robert@fintechgroup.com",
      phone: "+48 502 602 702",
      company: "FinTech Group",
      source: "DEMO",
      status: "NOWY",
      value: "35,000 PLN",
      date: "2026-01-07",
      time: "15:45",
      details: "Rezerwacja: 2026-01-12, 10:00",
      callDetails: "Zainteresowani integracją API",
      transcription: [
        { role: "ai", text: "Dzień dobry, potwierdzam spotkanie demo." },
        { role: "user", text: "Tak, zależy nam na omówieniu dokumentacji API." }
      ],
      aiSummary: "Potwierdzone demo. Klient zainteresowany aspektami technicznymi API.",
      product: "API Connect"
    }
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: 101,
      name: "Omega Corp",
      contact: "Marek Nowicki",
      email: "marek@omegacorp.pl",
      phone: "+48 600 100 200",
      company: "Omega Corp",
      source: "KONTAKT",
      status: "AKTYWNY",
      value: "25,000 PLN",
      priority: "HIGH",
      date: "2023-11-15",
      time: "10:00",
      details: "Stała obsługa prawna i doradztwo.",
      callDetails: "Ustalono warunki współpracy długoterminowej.",
      clientSince: "2023-12-01",
      product: "Konsulting",
      aiSummary: "Klient strategiczny. Wymaga comiesięcznych raportów.",
      type: "CUSTOMER",
      activeServices: ["Konsulting", "Raportowanie", "Doradztwo"]
    },
    {
      id: 102,
      name: "Beta Logistics",
      contact: "Anna Kowalczyk",
      email: "anna@betalog.pl",
      phone: "+48 500 200 300",
      company: "Beta Logistics",
      source: "USŁUGI",
      status: "AKTYWNY",
      value: "18,500 PLN",
      priority: "MEDIUM",
      date: "2023-10-20",
      time: "14:30",
      assignedEmployee: "Anna Nowak",
      details: "Implementacja systemu CRM.",
      callDetails: "Szkolenie pracowników zakończone sukcesem.",
      clientSince: "2023-11-05",
      product: "Wdrożenie CRM",
      type: "CUSTOMER",
      activeServices: ["Wdrożenie CRM", "Szkolenia"]
    }
  ]);

  const employees = [
    "Jan Kowalski",
    "Anna Nowak",
    "Piotr Zieliński",
    "Katarzyna Wiśniewska",
    "Tomasz Kot"
  ];

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1001,
      title: "Wdrożenie CRM dla Omega Corp",
      client: "Omega Corp",
      clientId: 101,
      status: "IN_PROGRESS",
      progress: 33,
      deadline: "2026-02-15",
      budget: "25,000 PLN",
      tasks: { completed: 1, total: 3 },
      priority: "HIGH",
      githubUrl: "https://github.com/feliz-trade/omega-crm",
      productTasks: [
        {
          id: 10011,
          title: "Integracja API",
          category: "System_Web",
          subcategories: [
            { name: "Backend", hours: 10 },
            { name: "Dokumentacja", hours: 4, assignedTo: "Jan Kowalski", completed: true }
          ],
          estimateHours: 14,
          deadline: "2026-02-10",
          completed: true
        },
        {
          id: 10012,
          title: "Konfiguracja panelu",
          category: "Rozwój SaaS",
          subcategories: [
            { name: "UI", hours: 6 },
            { name: "UX", hours: 3 },
            { name: "Testy", hours: 3 }
          ],
          estimateHours: 12,
          deadline: "2026-02-12",
          completed: false
        },
        {
          id: 10013,
          title: "Migracja danych",
          category: "Automatyzacja",
          subcategories: [
            { name: "ETL", hours: 8 },
            { name: "Walidacja", hours: 4 }
          ],
          estimateHours: 12,
          deadline: "2026-02-14",
          completed: false
        }
      ],
      aiSummary: "Projekt obejmuje integrację API, konfigurację panelu i migrację danych.",
      transcription: [{ role: "ai", text: "Ustalono zakres wdrożenia i terminy etapów." }],
      messages: [
        { id: 1, sender: "System", text: "Projekt utworzony", date: "2024-01-15 10:00", isSystem: true },
        { id: 2, sender: "Jan Kowalski", text: "Rozpoczęliśmy prace nad API. Dokumentacja jest gotowa.", date: "2024-01-16 09:30" },
        { id: 3, sender: "Klient", text: "Proszę o przyspieszenie prac nad migracją danych.", date: "2024-01-17 14:15" }
      ],
      checklist: [
        { id: 1, text: "Weryfikacja kodu (Code Review)", completed: true, completedBy: "Jan Kowalski", completedAt: "2024-01-20 10:00" },
        { id: 2, text: "Testy jednostkowe", completed: false },
        { id: 3, text: "Dokumentacja API", completed: true, completedBy: "Jan Kowalski", completedAt: "2024-01-22 14:30" },
        { id: 4, text: "Testy bezpieczeństwa", completed: false },
        { id: 5, text: "Zatwierdzenie przez klienta", completed: false }
      ]
    },
    {
      id: 1002,
      title: "Agenci AI dla Beta Logistics",
      client: "Beta Logistics",
      clientId: 102,
      status: "IN_PROGRESS",
      progress: 0,
      deadline: "2026-03-01",
      budget: "18,500 PLN",
      tasks: { completed: 0, total: 2 },
      priority: "MEDIUM",
      githubUrl: "https://github.com/feliz-trade/beta-logistics-ai",
      productTasks: [
        {
          id: 10021,
          title: "Agent do e-mail",
          category: "Agent_AI",
          subcategories: [
            { name: "NLP", hours: 10 },
            { name: "Integracje", hours: 6, assignedTo: "Anna Nowak" }
          ],
          estimateHours: 16,
          deadline: "2026-02-20",
          completed: false
        },
        {
          id: 10022,
          title: "Agent do telefonu",
          category: "Agent_AI",
          subcategories: [
            { name: "IVR", hours: 8 },
            { name: "Routing", hours: 4 }
          ],
          estimateHours: 12,
          deadline: "2026-02-25",
          completed: false
        }
      ],
      aiSummary: "Dwa agentów AI obsługujących e-mail i telefon z integracjami.",
      transcription: [{ role: "user", text: "Prosimy o nacisk na integracje z CRM." }]
    },
    {
      id: 1003,
      title: "Sklep B2B Green Energy",
      client: "Green Energy",
      clientId: 0,
      status: "PENDING",
      progress: 0,
      deadline: "2026-03-10",
      budget: "40,000 PLN",
      tasks: { completed: 0, total: 2 },
      priority: "HIGH",
      productTasks: [
        {
          id: 10031,
          title: "Koszyk i płatności",
          category: "System_Web",
          subcategories: [
            { name: "Stripe", hours: 6 },
            { name: "Koszyk", hours: 5 }
          ],
          estimateHours: 11,
          completed: false
        },
        {
          id: 10032,
          title: "Panel klienta",
          category: "System_Web",
          subcategories: [
            { name: "Profil", hours: 3 },
            { name: "Historia zamówień", hours: 4 }
          ],
          estimateHours: 7,
          completed: false
        }
      ]
    }
  ]);

  const [calendarNotes, setCalendarNotes] = useState<CalendarNote[]>([]);

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: "1",
      title: "Subskrypcja Vercel",
      amount: 20,
      currency: "USD",
      category: "Utrzymanie programu",
      date: "2024-03-01",
      user: "Admin User"
    },
    {
      id: "2",
      title: "OpenAI API Credits",
      amount: 50,
      currency: "USD",
      category: "Tokeny AI",
      date: "2024-03-05",
      user: "Admin User"
    }
  ]);

  const addCalendarNote = (note: Omit<CalendarNote, "id">) => {
    const newNote = { ...note, id: Math.random().toString(36).substr(2, 9) };
    setCalendarNotes(prev => [...prev, newNote]);
  };

  const deleteCalendarNote = (noteId: string) => {
    setCalendarNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const assignEmployee = (leadId: number, employee: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, assignedEmployee: employee } : lead
    ));
  };

  const moveLeadToClients = (leadId: number, assignedEmployee?: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      setClients(prev => [
        ...prev, 
        { 
          ...lead, 
          assignedEmployee: assignedEmployee ?? lead.assignedEmployee, 
          clientSince: new Date().toISOString().split('T')[0],
          type: "POTENTIAL", // Default when moving from leads
          activeServices: []
        }
      ]);
    }
  };

  const addLead = (leadData: Omit<Lead, "id" | "status" | "date" | "time">) => {
    const now = new Date();
    const newLead: Lead = {
      ...leadData,
      id: Math.max(...leads.map(l => l.id), 0) + 1,
      status: "NOWY",
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const addClient = (clientData: Omit<Client, "id" | "status" | "date" | "time" | "clientSince">) => {
    const now = new Date();
    const newClient: Client = {
      ...clientData,
      id: Math.max(...clients.map(c => c.id), 0) + 1,
      status: "AKTYWNY",
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
      clientSince: now.toISOString().split('T')[0],
      type: clientData.type || "POTENTIAL",
      activeServices: clientData.activeServices || []
    };
    setClients(prev => [newClient, ...prev]);
  };

  const deleteLead = (leadId: number) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
  };

  const updateLead = (leadId: number, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, ...updates } : lead
    ));
  };
  
  const updateClient = (clientId: number, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    ));
  };
  
  const addClientTask = (clientId: number, task: Omit<ProductTask, "id">) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, productTasks: [ ...(client.productTasks || []), { ...task, id: Date.now() } ] }
        : client
    ));
  };
  
  const updateClientTask = (clientId: number, taskId: number, updates: Partial<ProductTask>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            productTasks: (client.productTasks || []).map(t => t.id === taskId ? { ...t, ...updates } : t) 
          }
        : client
    ));
  };
  
  const deleteClientTask = (clientId: number, taskId: number) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, productTasks: (client.productTasks || []).filter(t => t.id !== taskId) }
        : client
    ));
  };

  const addProject = (project: Omit<Project, "id">) => {
    setProjects(prev => [ { ...project, id: Date.now() }, ...prev ]);
  };

  const updateProject = (projectId: number, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ));
  };

  const moveClientToProject = (clientId: number) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const totalTasks = (client.productTasks || []).length;
    const project: Omit<Project, "id"> = {
      title: client.product || `Projekt dla ${client.company}`,
      client: client.company,
      clientId: client.id,
      status: "IN_PROGRESS",
      progress: 0,
      deadline: client.finalDeadline || "",
      budget: client.value,
      tasks: { completed: 0, total: totalTasks },
      priority: "MEDIUM",
      productTasks: client.productTasks || [],
      aiSummary: client.aiSummary,
      transcription: client.transcription || [],
      callDetails: client.callDetails || "",
      details: client.details || "",
      assignedEmployee: client.assignedEmployee,
      finalDeadline: client.finalDeadline,
      clientNote: client.clientNote,
      projectChanges: client.projectChanges,
      value: client.value,
      product: client.product
    };
    addProject(project);
    updateClient(clientId, { status: "PRODUKCJA" });
  };

  const addInvoice = (clientId: number, invoice: Omit<Invoice, "id">) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9)
    };
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, invoices: [...(client.invoices || []), newInvoice] }
        : client
    ));
  };

  const updateInvoice = (clientId: number, invoiceId: string, updates: Partial<Invoice>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            invoices: (client.invoices || []).map(inv => inv.id === invoiceId ? { ...inv, ...updates } : inv)
          }
        : client
    ));
  };

  const deleteInvoice = (clientId: number, invoiceId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            invoices: (client.invoices || []).filter(inv => inv.id !== invoiceId)
          }
        : client
    ));
  };

  const addClientProgram = (clientId: number, program: Omit<ClientProgram, "id">) => {
    const newProgram = { ...program, id: Math.random().toString(36).substr(2, 9) };
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, programs: [...(client.programs || []), newProgram] }
        : client
    ));
  };

  const updateClientProgram = (clientId: number, programId: string, updates: Partial<ClientProgram>) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            programs: (client.programs || []).map(prog => prog.id === programId ? { ...prog, ...updates } : prog)
          }
        : client
    ));
  };

  const deleteClientProgram = (clientId: number, programId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { 
            ...client, 
            programs: (client.programs || []).filter(prog => prog.id !== programId)
          }
        : client
    ));
  };

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: Math.random().toString(36).substr(2, 9) };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const deleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  };

  return (
    <CRMContext.Provider value={{ 
      leads, clients, employees, projects, calendarNotes, 
      setLeads, setClients, setProjects, setCalendarNotes, 
      moveLeadToClients, addLead, addClient, deleteLead, 
      assignEmployee, updateLead, updateClient, 
      addClientTask, updateClientTask, deleteClientTask, 
      addProject, updateProject, moveClientToProject, 
      addCalendarNote, deleteCalendarNote,
      addInvoice, updateInvoice, deleteInvoice,
      addClientProgram, updateClientProgram, deleteClientProgram,
      expenses, addExpense, deleteExpense
    }}>
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error("useCRM must be used within a CRMProvider");
  }
  return context;
}

export type ProductTask = {
  id: number;
  category: "Agent_AI" | "Automatyzacja" | "Rozwój SaaS" | "System_Web" | "Zmiany w produkcie";
  title: string;
  subcategories: { name: string; hours: number; assignedTo?: string; completed?: boolean }[];
  estimateHours: number;
  deadline?: string;
  completed?: boolean;
};

export type Project = {
  id: number;
  title: string;
  client: string;
  clientId: number;
  status: "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "PENDING" | "ABANDONED";
  progress: number;
  deadline: string;
  budget: string;
  tasks: { completed: number; total: number };
  priority: "HIGH" | "MEDIUM" | "LOW";
  productTasks?: ProductTask[];
  aiSummary?: string;
  transcription?: { role: string; text: string }[];
  callDetails?: string;
  details?: string;
  assignedEmployee?: string;
  finalDeadline?: string;
  clientNote?: string;
  projectChanges?: string;
  abandonReason?: string;
  value?: string;
  product?: string;
  githubUrl?: string;
  messages?: { id: number; sender: string; text: string; date: string; isSystem?: boolean }[];
  checklist?: { id: number; text: string; completed: boolean; completedBy?: string; completedAt?: string }[];
};
