import { useState } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover
} from 'react-aria-components';
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';

function CurrentDatePicker() {
  // Get today's date in the user's local timezone
  const todayDate = today(getLocalTimeZone());
  const [date, setDate] = useState(todayDate);

  return (
    <div style={{ padding: '20px' }}>
      <DatePicker value={date} onChange={setDate}>
        <Label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Select a Date
        </Label>
        <Group style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <DateInput 
            style={{ 
              border: '1px solid #ccc', 
              padding: '8px', 
              borderRadius: '4px',
              minWidth: '200px'
            }}
          >
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <Button 
            style={{ 
              padding: '8px 16px', 
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0'
            }}
          >
            📅
          </Button>
        </Group>
        <Popover>
          <Dialog>
            <Calendar>
              <header style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                padding: '10px' 
              }}>
                <Button slot="previous">◀</Button>
                <Heading />
                <Button slot="next">▶</Button>
              </header>
              <CalendarGrid>
                {(date) => <CalendarCell date={date} />}
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
      
      {/* Display the selected date for debugging */}
      {date && (
        <p style={{ marginTop: '16px' }}>
          Selected date: {date.toString()}
        </p>
      )}
    </div>
  );
}

export default CurrentDatePicker;