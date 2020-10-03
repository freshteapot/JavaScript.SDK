// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Guid } from '@dolittle/rudiments';

import { StreamId, PartitionId, ScopeId } from '@dolittle/sdk.events';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';

import { Subscription } from './Subscription';
import { SubscriptionBuilderMethodAlreadyCalled } from './SubscriptionBuilderMethodAlreadyCalled';
import { SubscriptionDefinitionIncomplete } from './SubscriptionDefinitionIncomplete';
import { SubscriptionBuilderForConsumerScope } from './SubscriptionBuilderForConsumerScope';
import { SubscriptionCallbackArguments, SubscriptionCallbacks } from './SubscriptionCallbacks';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Represents the builder for building subscriptions on a tenant.
 */
export class SubscriptionBuilderForProducerPartition {
    private readonly _callbacks: SubscriptionCallbacks;
    private _consumerScopeId?: ScopeId;
    private _builder?: SubscriptionBuilderForConsumerScope;

    /**
     * Initializes a new instance of {@link SubscriptionBuilderForProducerTenant}.
     * @param {MicroserviceId} _producerMicroserviceId The microservice the subscriptions are for.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(
        private readonly _producerMicroserviceId: MicroserviceId,
        private readonly _producerTenantId: TenantId,
        private readonly _producerStreamId: StreamId,
        private readonly _producerPartitionId: PartitionId,
        responsesSource: Observable<SubscriptionCallbackArguments>) {
            this._callbacks = new SubscriptionCallbacks(
                responsesSource.pipe(filter(_ =>
                    _.subscription.partition.toString() === _producerPartitionId.toString())));
    }

    /**
     * Sets the producer stream to subscribe to events from.
     * @param {Guid | string} scopeId Stream to subscribe to events from.
     */
    toScope(scopeId: Guid | string): SubscriptionBuilderForConsumerScope {
        this.throwIfConsumerScopeIsAlreadyDefined();
        this._consumerScopeId = ScopeId.from(scopeId);
        this._builder = new SubscriptionBuilderForConsumerScope(
            this._producerMicroserviceId,
            this._producerTenantId,
            this._producerStreamId,
            this._producerPartitionId,
            this._consumerScopeId,
            this._callbacks.responses);
        return this._builder;
    }

    /**
     * Builds the subscription.
     * @param {Observable<SubscriptionCallbackArguments} callbackArgumentsSource The observable source of responses.
     * @returns {Subscription}
     */
    build(): Subscription {
        this.throwIfConsumerScopeIsNotDefined();
        return this._builder!.build();
    }

    private throwIfConsumerScopeIsAlreadyDefined() {
        if (this._consumerScopeId) {
            throw new SubscriptionBuilderMethodAlreadyCalled('toScope()');
        }
    }
    private throwIfConsumerScopeIsNotDefined() {
        if (!this._consumerScopeId) {
            throw new SubscriptionDefinitionIncomplete('Scope', 'Call toScope() with a non-default scope');
        }
    }
}
