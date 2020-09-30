// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';

import { IContainer } from '@dolittle/sdk.common';
import { Guid } from '@dolittle/rudiments';

import { IArtifacts } from '@dolittle/sdk.artifacts';
import { Cancellation } from '@dolittle/sdk.resilience';

import { EventHandlersClient } from '@dolittle/runtime.contracts/Runtime/Events.Processing/EventHandlers_grpc_pb';

import { IEventHandlers } from './IEventHandlers';
import { EventHandlerId } from './EventHandlerId';
import { EventHandlerBuilder, EventHandlerBuilderCallback } from './EventHandlerBuilder';
import { EventHandlers } from './EventHandlers';
import { ExecutionContext } from '@dolittle/sdk.execution';

export type EventHandlersBuilderCallback = (builder: EventHandlersBuilder) => void;

/**
 * Represents the builder for configuring event handlers
 */
export class EventHandlersBuilder {
    private _eventHandlers: Map<string, EventHandlerBuilder> = new Map();

    /**
     * Start building an event handler.
     * @param {Guid | string} eventHandlerId The unique identifier of the event handler.
     * @param {EventHandlerBuilderCallback} callback Callback for building out the event handler.
     */
    createEventHandler(eventHandlerId: Guid | string, callback: EventHandlerBuilderCallback): void {
        const id = EventHandlerId.from(eventHandlerId);
        const builder = new EventHandlerBuilder(id);
        callback(builder);
        this._eventHandlers.set(id.toString(), builder);
    }

    /**
     * Builds an instance for holding event handlers.
     * @returns {IEventHandlers} New instance.
     */
    build(
        client: EventHandlersClient,
        container: IContainer,
        executionContext: ExecutionContext,
        artifacts: IArtifacts,
        logger: Logger,
        cancellation: Cancellation): IEventHandlers {
        const eventHandlers = new EventHandlers(client, container, executionContext, artifacts, logger, cancellation);

        for (const [eventHandlerId, eventHandlerBuilder] of this._eventHandlers) {
            const eventHandler = eventHandlerBuilder.build(artifacts);
            eventHandlers.register(eventHandler, cancellation);
        }

        return eventHandlers;
    }
}
