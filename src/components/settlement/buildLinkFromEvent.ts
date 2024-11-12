import { RawInstructionEvent } from '@/services/repositories/types';

export function buildLinkFromEvent(
  event: RawInstructionEvent,
  linkWithEvent: boolean = false,
) {
  return !linkWithEvent
    ? event?.createdBlock?.id.toString()
    : `${event.createdBlock.id.toString()}?tab=event&event=${event.id.replace('/', '-')}`;
}
