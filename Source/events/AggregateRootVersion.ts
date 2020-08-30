// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import isNaturalNumber from 'is-natural-number';
import { ConceptAs } from '@dolittle/concepts';
import { EventLogSequenceNumberMustBeNaturalNumber } from './index';

/**
 * Represents the version of an aggregate root as a natural number, corresponding to the number of events the Aggregate Root has applied to an Event Source.
 *
 * @export
 * @class AggregateRootVersion
 * @extends {ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>}
 */
export class AggregateRootVersion extends ConceptAs<number, '@dolittle/sdk.events.EventLogSequenceNumber'>{

    constructor(value: number) {
        if (!isNaturalNumber(value, { includeZero: true })) throw new EventLogSequenceNumberMustBeNaturalNumber();
        super(value, '@dolittle/sdk.events.EventLogSequenceNumber');
    }

    /**
     * Represents the first {AggregateRootVersion}
     *
     * @static
     * @type {Generation}
     */
    static initial: AggregateRootVersion = AggregateRootVersion.from(0);

    /**
     * Creates a {AggregateRootVersion} from a number.
     *
     * @static
     * @param {number} value
     * @returns {Generation}
     */
    static from(value: number): AggregateRootVersion {
        return new AggregateRootVersion(value);
    }
}
