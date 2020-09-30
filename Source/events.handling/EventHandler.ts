// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { EventTypeMap, EventType } from '@dolittle/sdk.artifacts';
import { EventContext, ScopeId } from '@dolittle/sdk.events';

import { EventHandlerDecoratedTypes } from './EventHandlerDecoratedTypes';
import { IEventHandler } from './IEventHandler';
import { EventHandlerSignature } from './EventHandlerSignature';
import { MissingEventHandlerForType } from './MissingEventHandlerForType';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerDecoratedType } from './EventHandlerDecoratedType';
import { EventHandlerOptions } from './EventHandlerOptions';

/**
 * Represents an implementation of {@link IEventHandler}.
 */
export class EventHandler implements IEventHandler {

    /**
     * Initializes a new instance of {@link EventHandler}
     * @param {EventHandlerId} eventHandlerId The unique identifier of the event handler.
     * @param {ScopeId} scopeId The identifier of the scope the event handler is in.
     * @param {boolean} partitioned Whether or not the event handler is partitioned.
     * @param {EventTypeMap<EventHandlerSignature<any>>} handleMethodsByEventType Handle methods per event type.
     */
    constructor(
        readonly eventHandlerId: EventHandlerId,
        readonly scopeId: ScopeId,
        readonly partitioned: boolean,
        readonly handleMethodsByEventType: EventTypeMap<EventHandlerSignature<any>>) {
    }

    /** @inheritdoc */
    get handledEvents(): Iterable<EventType> {
        return this.handleMethodsByEventType.keys();
    }

    /** @inheritdoc */
    async handle(event: any, eventTypes: EventType, context: EventContext): Promise<void> {
        if (this.handleMethodsByEventType.has(eventTypes)) {
            const method = this.handleMethodsByEventType.get(eventTypes)!;
            await method(event, context);
        } else {
            throw new MissingEventHandlerForType(eventTypes);
        }
    }
}

/**
 * Decorator to mark a class as an EventHandler.
 * @param {string | Guid | EventHandlerId} eventHandlerId EventHandler's given id
 * @param {EventHandlerOptions} [options={}] Options to give to the EventHandler
 */
export function eventHandler(eventHandlerId: string | Guid | EventHandlerId, options: EventHandlerOptions = {}) {
    return function (target: any) {
        EventHandlerDecoratedTypes.register(new EventHandlerDecoratedType(
            EventHandlerId.from(eventHandlerId),
            options.inScope ? ScopeId.from(options.inScope) : ScopeId.default,
            !options.unpartitioned,
            target));
    };
}
