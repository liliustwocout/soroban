import { useEffect } from "react";
import { SorobanRpc, xdr } from "stellar-sdk";

interface GeneratedLibrary {
  Server: SorobanRpc.Server;
  CONTRACT_ID_HEX: string;
}

interface GetEventsWithLatestLedger {
  latestLedger: string | number;
  events?: any[];
}

type PagingKey = string;

const paging: Record<
  PagingKey,
  { lastLedgerStart?: number; pagingToken?: string }
> = {};

export function useSubscription(
  library: GeneratedLibrary,
  topic: string,
  onEvent: (event: any) => void,
  pollInterval = 5000
) {
  const id = `${library.CONTRACT_ID_HEX}:${topic}`;
  paging[id] = paging[id] || {};

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let stop = false;

    async function pollEvents(): Promise<void> {
      try {
        if (!paging[id].lastLedgerStart) {
          let latestLedgerState = await library.Server.getLatestLedger();
          paging[id].lastLedgerStart = latestLedgerState.sequence;
        }

        let response = (await library.Server.getEvents({
          startLedger: !paging[id].pagingToken
            ? paging[id].lastLedgerStart
            : undefined,
          cursor: paging[id].pagingToken,
          filters: [
            {
              contractIds: [library.CONTRACT_ID_HEX],
              topics: [[xdr.ScVal.scvSymbol(topic).toXDR("base64")]],
              type: "contract",
            },
          ],
          limit: 10,
        })) as GetEventsWithLatestLedger;

        paging[id].pagingToken = undefined;

        if (response.latestLedger) {
          paging[id].lastLedgerStart = typeof response.latestLedger === 'string'
            ? parseInt(response.latestLedger, 10)
            : response.latestLedger;
        }

        if (response.events && Array.isArray(response.events)) {
          response.events.forEach((event: any) => {
            try {
              onEvent(event);
            } catch (error) {
              console.error("Poll Events: Subscription Callback Had Error: ", error);
            } finally {
              paging[id].pagingToken = event.pagingToken;
            }
          });
        }
      } catch (error) {
        console.error("Poll Events: Error: ", error);
      } finally {
        if (!stop) {
          timeoutId = setTimeout(pollEvents, pollInterval);
        }
      }
    }

    pollEvents();

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      stop = true;
    };
  }, [library, topic, onEvent, id, pollInterval]);
}