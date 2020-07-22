// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Logger } from 'winston';
import { map } from 'rxjs/operators';

import { callContexts, failures } from '@dolittle/sdk.protobuf';
import { ArtifactId, Artifact, IArtifacts } from '@dolittle/sdk.artifacts';
import { IExecutionContextManager } from '@dolittle/sdk.execution';
import { Cancellation } from '@dolittle/sdk.resilience';
import { reactiveUnary } from '@dolittle/sdk.services';

import { EventStoreClient } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_grpc_pb';
import { CommitEventsRequest } from '@dolittle/runtime.contracts/Runtime/Events/EventStore_pb';

import { CommittedEvents } from './CommittedEvents';
import { CommitEventsResponse } from './CommitEventsResponse';
import { EventConverters } from './EventConverters';
import { EventSourceId } from './EventSourceId';
import { IEventStore } from './IEventStore';
import { UncomittedEvent } from './UncomittedEvent';


/**
 * Represents an implementation of {IEventStore}
 */
export class EventStore implements IEventStore {
    constructor(
        private _eventStoreClient: EventStoreClient,
        private _artifacts: IArtifacts,
        private _executionContextManager: IExecutionContextManager,
        private _logger: Logger) {
    }

    /** @inheritdoc */
    commit(event: any, eventSourceId: EventSourceId, artifact?: Artifact | ArtifactId, cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(events: UncomittedEvent[], cancellation?: Cancellation): Promise<CommitEventsResponse>;
    commit(eventOrEvents: any, eventSourceIdOrCancellation?: any, artifact?: Artifact | ArtifactId, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        if (arguments.length < 3) {
            return this.commitInternal(eventOrEvents, eventSourceIdOrCancellation);
        } else {
            const events: UncomittedEvent[] = [{
                content: eventOrEvents,
                eventSourceId: eventSourceIdOrCancellation,
                artifact,
                public: false,
            }];
            return this.commitInternal(events, cancellation);
        }
    }

    /** @inheritdoc */
    commitPublic(event: any, eventSourceId: EventSourceId, artifact?: Artifact | ArtifactId, cancellation?: Cancellation): Promise<CommitEventsResponse> {
        const events: UncomittedEvent[] = [{
            content: event,
            eventSourceId,
            artifact,
            public: true,
        }];
        return this.commitInternal(events, cancellation);
    }

    private async commitInternal(events: UncomittedEvent[], cancellation = Cancellation.default): Promise<CommitEventsResponse> {
        const uncommittedEvents = events.map(event =>
            EventConverters.getUncommittedEventFrom(
                event.content,
                event.eventSourceId,
                this._artifacts.resolveFrom(event.content, event.artifact),
                !!event.public));

        const request = new CommitEventsRequest();
        request.setCallcontext(callContexts.toProtobuf(this._executionContextManager.current));
        request.setEventsList(uncommittedEvents);

        return reactiveUnary(this._eventStoreClient, this._eventStoreClient.commit, request, cancellation)
            .pipe(map(response => {
                const committedEvents = new CommittedEvents(...response.getEventsList().map(event => EventConverters.toSDK(event)));
                return new CommitEventsResponse(committedEvents, failures.toSDK(response.getFailure()));
            })).toPromise();
    }
}
