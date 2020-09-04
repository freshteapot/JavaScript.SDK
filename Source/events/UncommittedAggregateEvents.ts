// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { UncommittedAggregateEvent, EventSourceId, AggregateRootVersion } from './index';
import { Guid } from '@dolittle/rudiments';


/**
 * Represents a sequence of {@link UncommittedAggregateEvent} applied by an AggregateRoot to an Event Source that have not been committed to the Event Store.
 *
 * @export
 * @class UncommittedAggregateEvents
 * @implements {Iterable<UncommittedAggregateEvent>}
 */
export class UncommittedAggregateEvents implements Iterable<UncommittedAggregateEvent> {
    private _events: UncommittedAggregateEvent[] = [];

    /**
     * Creates an instance of {@link UncommittedAggregateEvents}.
     * @param {EventSourceId} eventSourceId The Event Source Id
     * @param {Function} aggregateRoot The type of the Aggregate Root
     * @param {AggregateRootVersion} expectedAggregateRootVersion The expected Aggregate Root Version
     * @param {...UncommittedAggregateEvent[]} events The events to commit
     */
    constructor(
        readonly eventSourceId: EventSourceId,
        readonly aggregateRoot: Function,
        readonly expectedAggregateRootVersion: AggregateRootVersion,
        ...events: UncommittedAggregateEvent[]) {
        if (events) {
            this._events = events;
        }
    }

    static from(eventSourceId: Guid | string, aggregateRoot: Function, expectedAggregateRootVersion: number, ...events: UncommittedAggregateEvent[]): UncommittedAggregateEvents {
        return new UncommittedAggregateEvents(EventSourceId.from(eventSourceId), aggregateRoot, AggregateRootVersion.from(expectedAggregateRootVersion), ...events);
    }

    /** @inheritdoc */
    [Symbol.iterator](): Iterator<any, any, undefined> {
        let position = 0;
        const self = this;
        return {
            next() {
                return {
                    done: position === self._events.length,
                    value: self._events[position++]
                };
            }
        };
    }

    /**
     * Convert uncommitted aggregate events to an array.
     * @returns {UncommittedAggregateEvent[]} Array of committed events.
     */
    toArray(): UncommittedAggregateEvent[] {
        return [...this._events];
    }
}
