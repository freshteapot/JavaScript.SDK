// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import isNaturalNumber from 'is-natural-number';
import { ConceptAs } from '@dolittle/concepts';
import { EventLogSequenceNumberMustBeNaturalNumber } from './EventLogSequenceNumberMustBeNaturalNumber';

/**
 * Represents the event log sequence number of a Committed Event.
 *
 * @export
 * @class EventLogSequenceNumber
 * @extends {ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>}
 */
export class EventLogSequenceNumber extends ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>{

    constructor(value: number) {
        if (!isNaturalNumber(value, { includeZero: true })) throw new EventLogSequenceNumberMustBeNaturalNumber();
        super(value, '@dolittle/sdk.events.EventLogSequenceNumber');
    }

    /**
     * Represents the first {EventLogSequenceNumber}
     *
     * @static
     * @type {Generation}
     */
    static first: EventLogSequenceNumber = EventLogSequenceNumber.from(0);

    /**
     * Creates a {EventLogSequenceNumber} from a number.
     *
     * @static
     * @param {number} value
     * @returns {Generation}
     */
    static from(value: number): EventLogSequenceNumber {
        return new EventLogSequenceNumber(value);
    }
}
