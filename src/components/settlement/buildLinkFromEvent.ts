import { RawInstructionEvent } from '@/services/repositories/types';

export function buildLinkFromEvent(
  event: RawInstructionEvent,
  linkWithEvent: boolean = false,
) {
  const { blockId } = event.createdBlock;

  return !linkWithEvent
    ? blockId.toString()
    : `${blockId.toString()}?tab=event&event=${blockId}-${event.eventIdx}`;
}
