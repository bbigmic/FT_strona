"use client";

import { useState } from "react";
import { useCRM, Lead, Project, CalendarNote } from "../../context/CRMContext";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle, AlertCircle, Phone, X, Flag, StickyNote, Plus } from "lucide-react";

type LeadWithReservation = Lead & {
  reservationDate: string;
  reservationTime: string;
  reservationDateTime: Date;
  type: 'lead';
};

type ProjectDeadline = Project & {
  deadlineDate: Date;
  type: 'project';
};

type NoteEvent = CalendarNote & {
  type: 'note';
  noteDate: Date;
};

type CalendarEvent = LeadWithReservation | ProjectDeadline | NoteEvent;

export default function CalendarPage() {
  const { leads, projects, calendarNotes, addCalendarNote, deleteCalendarNote } = useCRM();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  // Parse demo leads with reservation dates
  const demoLeads = leads
    .filter((l) => l.source === "DEMO")
    .map((l): LeadWithReservation | null => {
      const match = l.details.match(/Rezerwacja: (\d{4}-\d{2}-\d{2}), (\d{2}:\d{2})/);
      if (match) {
        return {
          ...l,
          reservationDate: match[1],
          reservationTime: match[2],
          reservationDateTime: new Date(`${match[1]}T${match[2]}`),
          type: 'lead'
        };
      }
      return null;
    })
    .filter((l): l is LeadWithReservation => l !== null);

  // Parse projects with deadlines
  const projectDeadlines = projects
    .filter(p => p.deadline)
    .map((p): ProjectDeadline => ({
      ...p,
      deadlineDate: new Date(p.deadline),
      type: 'project'
    }));

  // Parse notes
  const noteEvents = calendarNotes.map((n): NoteEvent => ({
    ...n,
    noteDate: new Date(n.date),
    type: 'note'
  }));

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthNames = [
    "Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
    "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDay = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    const leads = demoLeads.filter((lead) => {
      const leadDate = lead.reservationDateTime;
      return (
        leadDate.getDate() === day &&
        leadDate.getMonth() === currentDate.getMonth() &&
        leadDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const projects = projectDeadlines.filter((project) => {
      const projectDate = project.deadlineDate;
      return (
        projectDate.getDate() === day &&
        projectDate.getMonth() === currentDate.getMonth() &&
        projectDate.getFullYear() === currentDate.getFullYear()
      );
    });

    const notes = noteEvents.filter((note) => {
      const noteDate = note.noteDate;
      return (
        noteDate.getDate() === day &&
        noteDate.getMonth() === currentDate.getMonth() &&
        noteDate.getFullYear() === currentDate.getFullYear()
      );
    });

    return [...leads, ...projects, ...notes];
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setIsAddingNote(false);
    setNewNoteContent("");
  };

  const handleAddNote = () => {
    if (!selectedDate || !newNoteContent.trim()) return;
    
    // Adjust for timezone offset to get correct YYYY-MM-DD
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    addCalendarNote({
      date: dateStr,
      content: newNoteContent.trim()
    });
    setNewNoteContent("");
    setIsAddingNote(false);
  };

  const selectedEvents = selectedDate ? getEventsForDay(selectedDate.getDate()) : [];

  return (
    <div className="flex gap-8 h-[calc(100vh-8rem)]">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col space-y-8 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Kalendarz Demo
            </h1>
            <p className="text-gray-400 mt-2">
              Harmonogram zaplanowanych prezentacji i spotkań
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 min-w-[200px] justify-center">
              <CalendarIcon className="w-5 h-5 text-accent" />
              <span className="text-lg font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
            </div>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden flex flex-col flex-1">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-white/5 shrink-0">
            {["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"].map(
              (day) => (
                <div
                  key={day}
                  className="py-4 text-center text-sm font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </div>
              )
            )}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 grid-rows-5 bg-white/5 gap-px border-b border-white/10 flex-1">
            {/* Empty cells for previous month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="bg-[#0a0a0a] p-4 opacity-50"
              />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);

              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={`bg-[#0a0a0a] p-3 transition-colors relative group border-r border-white/5 last:border-r-0 cursor-pointer flex flex-col ${
                    isSelectedDay ? "bg-white/[0.03]" : "hover:bg-white/[0.02]"
                  } ${isCurrentDay ? "bg-accent/[0.02]" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                        isCurrentDay
                          ? "bg-accent text-black font-bold"
                          : isSelectedDay
                          ? "bg-white text-black font-bold"
                          : "text-gray-400 group-hover:text-white"
                      }`}
                    >
                      {day}
                    </span>
                  </div>

                  <div className="flex-1 flex items-center justify-center flex-wrap gap-1.5">
                    {/* Red: Unassigned Leads */}
                    {dayEvents.filter(e => e.type === 'lead' && !e.assignedEmployee && e.status !== "ROZMOWA ODBYTA").length > 0 && (
                      <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center text-[10px] font-bold">
                        {dayEvents.filter(e => e.type === 'lead' && !e.assignedEmployee && e.status !== "ROZMOWA ODBYTA").length}
                      </div>
                    )}
                    
                    {/* Cyan: Assigned Leads */}
                    {dayEvents.filter(e => e.type === 'lead' && e.assignedEmployee && e.status !== "ROZMOWA ODBYTA").length > 0 && (
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                        {dayEvents.filter(e => e.type === 'lead' && e.assignedEmployee && e.status !== "ROZMOWA ODBYTA").length}
                      </div>
                    )}

                    {/* Green: Completed Leads */}
                    {dayEvents.filter(e => e.type === 'lead' && e.status === "ROZMOWA ODBYTA").length > 0 && (
                      <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 flex items-center justify-center text-[10px] font-bold">
                        {dayEvents.filter(e => e.type === 'lead' && e.status === "ROZMOWA ODBYTA").length}
                      </div>
                    )}

                    {/* Purple: Projects */}
                    {dayEvents.filter(e => e.type === 'project').length > 0 && (
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/50 text-purple-400 flex items-center justify-center text-[10px] font-bold">
                        {dayEvents.filter(e => e.type === 'project').length}
                      </div>
                    )}

                    {/* Yellow: Notes */}
                    {dayEvents.filter(e => e.type === 'note').length > 0 && (
                      <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 flex items-center justify-center text-[10px] font-bold">
                        {dayEvents.filter(e => e.type === 'note').length}
                      </div>
                    )}
                  </div>
                  
                  {isSelectedDay && (
                    <div className="absolute inset-0 border-2 border-accent/50 rounded-none pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel - Day Details */}
      <div className="w-[400px] shrink-0 flex flex-col h-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
        {selectedDate ? (
          <>
            <div className="p-6 border-b border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]}
                </h2>
                <span className="text-gray-400">
                  {["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"][selectedDate.getDay()]}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">
                  {selectedEvents.length} {selectedEvents.length === 1 ? "wydarzenie" : "wydarzeń"}
                </p>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider rounded-lg border border-accent/20 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Dodaj notatkę
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isAddingNote && (
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <h3 className="text-sm font-bold text-yellow-500 mb-2 flex items-center gap-2">
                    <StickyNote className="w-4 h-4" />
                    NOWA NOTATKA
                  </h3>
                  <textarea
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Wpisz treść notatki..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 min-h-[100px] mb-3 resize-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors"
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!newNoteContent.trim()}
                      className="px-3 py-1.5 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Zapisz
                    </button>
                  </div>
                </div>
              )}

              {selectedEvents.length > 0 ? (
                selectedEvents.map((event, idx) => {
                  if (event.type === 'lead') {
                    return (
                      <div
                        key={`${event.id}-${idx}`}
                        className={`p-4 rounded-xl border transition-all hover:scale-[1.02] cursor-pointer group ${
                          event.status === "ROZMOWA ODBYTA"
                            ? "bg-green-500/5 border-green-500/20 hover:bg-green-500/10"
                            : event.assignedEmployee 
                              ? "bg-cyan-500/5 border-cyan-500/20 hover:bg-cyan-500/10" 
                              : "bg-red-500/5 border-red-500/20 hover:bg-red-500/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider ${
                            event.status === "ROZMOWA ODBYTA"
                              ? "bg-green-500/10 border-green-500/20 text-green-400"
                              : event.assignedEmployee 
                                ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" 
                                : "bg-red-500/10 border-red-500/20 text-red-400"
                          }`}>
                            {event.status === "ROZMOWA ODBYTA" ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            <span>{event.reservationTime}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded border ${
                            event.status === "ROZMOWA ODBYTA"
                              ? "border-green-500/20 text-green-400"
                              : "border-white/10 text-gray-400"
                          }`}>
                            {event.source}
                          </span>
                        </div>

                        <h3 className={`text-lg font-bold mb-1 ${
                           event.status === "ROZMOWA ODBYTA" ? "text-gray-400 line-through" : "text-white group-hover:text-accent transition-colors"
                        }`}>
                          {event.company}
                        </h3>
                        
                        <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{event.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span>{event.phone}</span>
                          </div>
                          {event.assignedEmployee && (
                             <div className="flex items-center gap-2 text-sm text-cyan-400 mt-2 bg-cyan-500/5 p-2 rounded-lg border border-cyan-500/10">
                               <User className="w-4 h-4" />
                               <span className="font-medium">Opiekun: {event.assignedEmployee}</span>
                             </div>
                          )}
                        </div>
                      </div>
                    );
                  } else if (event.type === 'project') {
                    return (
                      <div
                        key={`proj-${event.id}-${idx}`}
                        className="p-4 rounded-xl border bg-purple-500/5 border-purple-500/20 hover:bg-purple-500/10 transition-all hover:scale-[1.02] group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs font-bold uppercase tracking-wider bg-purple-500/10 border-purple-500/20 text-purple-400">
                            <Flag className="w-3 h-3" />
                            <span>DEADLINE</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded border ${
                            event.priority === "HIGH" 
                              ? "border-red-500/20 text-red-400"
                              : event.priority === "MEDIUM"
                              ? "border-yellow-500/20 text-yellow-400"
                              : "border-blue-500/20 text-blue-400"
                          }`}>
                            {event.priority}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-400 mb-3">{event.client}</p>

                        <div className="space-y-2 pt-3 border-t border-white/5">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Postęp</span>
                            <span className="text-white font-mono">{event.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${event.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={`note-${event.id}-${idx}`}
                        className="p-4 rounded-xl border bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10 transition-all hover:scale-[1.02] group relative"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteCalendarNote(event.id);
                          }}
                          className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                            <StickyNote className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider">
                            Notatka
                          </span>
                        </div>

                        <p className="text-white text-sm whitespace-pre-wrap leading-relaxed">
                          {event.content}
                        </p>
                      </div>
                    );
                  }
                })
              ) : (
                !isAddingNote && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                      <CalendarIcon className="w-8 h-8 opacity-50" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-white">Brak wydarzeń</p>
                      <p className="text-sm mt-1">
                        Wybierz inny dzień lub dodaj nowe wydarzenie
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAddingNote(true)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors text-sm font-medium"
                    >
                      Dodaj pierwszą notatkę
                    </button>
                  </div>
                )
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <CalendarIcon className="w-12 h-12 mb-4 opacity-50" />
            <p>Wybierz dzień z kalendarza,</p>
            <p>aby zobaczyć szczegóły</p>
          </div>
        )}
      </div>
    </div>
  );
}
