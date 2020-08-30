// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommittedAggregateEvent, EventSourceId, AggregateRootVersion } from './index';

/**
 * Represents a collection of committed aggregate events.
 *
 * @summary This type implements Iterable<CommittedAggregateEvent> and can be used for iterations directly.
 */
export class CommittedAggregateEvents implements Iterable<CommittedAggregateEvent> {
    private _events: CommittedAggregateEvent[] = [];

    static readonly empty: CommittedAggregateEvents = new CommittedAggregateEvents(EventSourceId.notSet, () => {});

    /**
     * Creates an instance of {@link CommittedEvents}.
     * @param {...CommittedEvent[]} events Events to initialize with.
     */
    constructor(
        readonly eventSourceId: EventSourceId,
        readonly aggregateRoot: Function,
        ...events: CommittedAggregateEvent[]) {
        if (events) {
            this._events = events;
        }
    }

    get aggregateRootVersion(): AggregateRootVersion {
        return this._events.length === 0 ?
            AggregateRootVersion.initial
            : this._events[this._events.length - 1].aggregateRootVersion;
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
     * Convert committed aggregate events to an array.
     * @returns {CommittedAggregateEvent[]} Array of committed events.
     */
    toArray(): CommittedAggregateEvent[] {
        return [...this._events];
    }
}
