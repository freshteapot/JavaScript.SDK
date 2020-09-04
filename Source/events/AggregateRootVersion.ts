// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import isNaturalNumber from 'is-natural-number';
import { ConceptAs } from '@dolittle/concepts';
import { AggregateRootVersionMustBeNaturalNumber } from './index';

/**
 * Represents a version of an aggregate root as a natural number, corresponding to the number of events the Aggregate Root has applied to an Event Source.
 *
 * @export
 * @class AggregateRootVersion
 * @extends {ConceptAs<number, '@dolittle/sdk.events.AggregateRootVersion'>}
 */

export class AggregateRootVersion extends ConceptAs<number, '@dolittle/sdk.events.AggregateRootVersion'> {

    constructor(value: number) {
        if (!isNaturalNumber(value, { includeZero: true })) {throw new AggregateRootVersionMustBeNaturalNumber();}
        super(value, '@dolittle/sdk.events.AggregateRootVersion');
    }

    /**
     * Represents the first {@link AggregateRootVersion}
     *
     * @static
     * @type {Generation}
     */

    static initial: AggregateRootVersion = AggregateRootVersion.from(0);

    /**
     * Creates a {@link EventLogSequenceNumber} from a number.
     *
     * @static
     * @param {number} value
     * @returns {AggregateRootVersion}
     */

    static from(value: number): AggregateRootVersion {
        return new AggregateRootVersion(value);
    }
}
