// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.
import { DateTime } from 'luxon';
import { Artifact } from '@dolittle/sdk.artifacts';
import { ExecutionContext } from '@dolittle/sdk.execution';
import { EventSourceId, EventLogSequenceNumber, AggregateRootVersion, CommittedEvent } from './index';

/**
 * Represents a committed aggregate event.
 *
 * @export
 * @class CommittedAggregateEvent
 * @extends {CommittedEvent}
 */
export class CommittedAggregateEvent extends CommittedEvent {
    /**
     * Creates an instance of CommittedAggregateEvent.
     * @param {EventLogSequenceNumber} eventLogSequenceNumber
     * @param {DateTime} occurred
     * @param {EventSourceId} eventSourceId
     * @param {Function} aggregateRoot
     * @param {AggregateRootVersion} aggregateRootVersion
     * @param {ExecutionContext} executionContext
     * @param {Artifact} type
     * @param {*} content
     * @param {boolean} isPublic
     */
    constructor(
        eventLogSequenceNumber: EventLogSequenceNumber,
        occurred: DateTime,
        eventSourceId: EventSourceId,
        readonly aggregateRoot: Function,
        readonly aggregateRootVersion: AggregateRootVersion,
        executionContext: ExecutionContext,
        type: Artifact,
        content: any,
        isPublic: boolean) {
        super(
            eventLogSequenceNumber,
            occurred,
            eventSourceId,
            executionContext,
            type,
            content,
            isPublic,
            false,
            EventLogSequenceNumber.first,
            new DateTime());
    }
}

