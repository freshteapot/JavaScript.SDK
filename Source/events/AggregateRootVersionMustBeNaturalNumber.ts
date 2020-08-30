// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { Exception } from '@dolittle/rudiments';

/**
 * Exception that gets thrown when {AggregateRootVersion} is not a natural number.
 *
 * @export
 * @class AggregateRootVersionMustBeNaturalNumber
 * @extends {Exception}
 */
export class AggregateRootVersionMustBeNaturalNumber extends Exception {
    constructor() {
        super('The aggregate root version must be a natural number');
    }
}
