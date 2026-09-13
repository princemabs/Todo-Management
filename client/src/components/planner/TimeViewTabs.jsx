import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export function TimeViewTabs({ view, onViewChange, dayPanel, weekPanel, monthPanel, yearPanel }) {
  return (
    <TabsRoot value={view} onValueChange={onViewChange}>
      <TabsList className="grid w-full grid-cols-4 gap-1 p-1">
        <TabsTrigger value="day" className="px-2 py-2.5 text-xs sm:px-4 sm:text-sm">
          Jour
        </TabsTrigger>
        <TabsTrigger value="week" className="px-2 py-2.5 text-xs sm:px-4 sm:text-sm">
          Semaine
        </TabsTrigger>
        <TabsTrigger value="month" className="px-2 py-2.5 text-xs sm:px-4 sm:text-sm">
          Mois
        </TabsTrigger>
        <TabsTrigger value="year" className="px-2 py-2.5 text-xs sm:px-4 sm:text-sm">
          Année
        </TabsTrigger>
      </TabsList>
      <TabsContent value="day">{dayPanel}</TabsContent>
      <TabsContent value="week">{weekPanel}</TabsContent>
      <TabsContent value="month">{monthPanel}</TabsContent>
      <TabsContent value="year">{yearPanel}</TabsContent>
    </TabsRoot>
  );
}
