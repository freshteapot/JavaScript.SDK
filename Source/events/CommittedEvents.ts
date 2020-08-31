// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { CommittedEvent } from './index';

/**
 * Represents a collection of committed events.
 *
 * @summary This type implements Iterable<CommittedEvent> and can be used for iterations directly.
 */
export class CommittedEvents implements Iterable<CommittedEvent> {
    private _events: CommittedEvent[] = [];

    static readonly empty: CommittedEvents = new CommittedEvents();

    /**
     * Creates an instance of {@link CommittedEvents}.
     * @param {...CommittedEvent[]} events Events to initialize with.
     */
    constructor(...events: CommittedEvent[]) {
        if (events) {
            this._events = events;
        }
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
     * Convert committed events to an array.
     * @returns {CommittedEvent[]} Array of committed events.
     */
    toArray(): CommittedEvent[] {
        return [...this._events];
    }
}
