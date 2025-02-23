import { GoToDay } from './GoToDay'
import { JournalShortcut } from './JournalShortcut'

export const JournalNav = ({ date }: { date?: string }) => {
  const currentDate = new Date(date ?? Date.now())

  return (
    <div
      contentEditable={false}
      className="text-xs font-normal flex items-center gap-4 text-foreground/60"
    >
      <JournalShortcut date={date} />
      <GoToDay initialDate={currentDate} />
    </div>
  )
}
