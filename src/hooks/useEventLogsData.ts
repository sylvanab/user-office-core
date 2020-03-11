import { useEffect, useState } from 'react';
import { useDataApi } from './useDataApi';
import { EventLog, User } from '../generated/sdk';

export function useEventLogsData(eventType: string, changedObjectId: string) {
  const api = useDataApi();
  const [eventLogsData, setEventLogsData] = useState<EventLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api()
      .getEventLogs({
        changedObjectId,
        eventType,
      })
      .then(data => {
        if (data.eventLogs) {
          setEventLogsData(
            data.eventLogs.map(eventLog => {
              return {
                ...eventLog,
                changedBy: eventLog.changedBy as User
              };
            })
          );
        }
        setLoading(false);
      });
  }, [eventType, changedObjectId, api]);

  return { loading, eventLogsData, setEventLogsData };
}
