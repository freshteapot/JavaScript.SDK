// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';
import { Constructor } from '@dolittle/types';

import { EventTypeId } from '@dolittle/sdk.artifacts';

import { HandlesDecoratedMethods } from './HandlesDecoratedMethods';

/**
 * Decorator for decorating handle methods.
 */
export function handles(typeOrId: Constructor<any> | EventTypeId | Guid | string, generation?: number) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        HandlesDecoratedMethods.register(target.constructor, typeOrId, generation, descriptor.value, propertyKey);
    };
}
