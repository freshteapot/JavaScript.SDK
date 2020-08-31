// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MicroserviceId, TenantId } from '@dolittle/sdk.execution';
import {
    TenantWithSubscriptions,
    SubscriptionBuilder,
    SubscriptionCallbacks,
    SubscriptionCallbackArguments,
    SubscriptionBuilderCallback,
    SubscriptionCompleted,
    SubscriptionSucceeded,
    SubscriptionFailed
} from './index';
import { Guid } from '@dolittle/rudiments';

export type TenantWithSubscriptionsBuilderCallback = (builder: TenantWithSubscriptionsBuilder) => void;

/**
 * Represents the builder of {@link TenantSubscriptions}.
 */
export class TenantWithSubscriptionsBuilder {
    readonly _subscriptionBuilders: SubscriptionBuilder[] = [];
    readonly callbacks: SubscriptionCallbacks = new SubscriptionCallbacks();

    /**
     * Initializes a new instance of {@link TenantWithSubscriptionsBuilder}.
     * @param {TenantId} _consumerTenant The consumer tenant.
     * @param {Observable<SubscriptionCallbackArguments>} responsesSource The source of responses.
     */
    constructor(private _consumerTenant: TenantId, responsesSource: Observable<SubscriptionCallbackArguments>) {
        this.callbacks = new SubscriptionCallbacks(responsesSource.pipe(filter(_ => _.consumerTenant.toString() === _consumerTenant.toString())));
    }

    /**
     * Build subscriptions for a specific microservice.
     * @param {Guid | string} microservice Microservice to build for.
     * @param {SubscriptionBuilderCallback} callback Builder callback.
     * @returns {TenantWithSubscriptionsBuilder}
     */
    forMicroservice(microservice: Guid | string, callback: SubscriptionBuilderCallback): TenantWithSubscriptionsBuilder {
        const builder = new SubscriptionBuilder(MicroserviceId.from(microservice), this.callbacks.responses);
        callback(builder);
        this._subscriptionBuilders.push(builder);
        return this;
    }

    /**
     * Sets the {@link SubscriptionCompleted} callback for all subscriptions on the event horizon
     * @param {SubscriptionCompleted} completed The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onCompleted(completed: SubscriptionCompleted): TenantWithSubscriptionsBuilder {
        this.callbacks.onCompleted(completed);
        return this;
    }

    /**
     * Sets the {@link SubscriptionSucceeded} callback for all subscriptions on the event horizon
     * @param {SubscriptionSucceeded} succeeded The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onSuccess(succeeded: SubscriptionSucceeded): TenantWithSubscriptionsBuilder {
        this.callbacks.onSucceeded(succeeded);
        return this;
    }

    /**
     * Sets the {@link SubscriptionFailed} callback for all subscriptions on the event horizon
     * @param {SubscriptionFailed} failed The callback method.
     * @returns {TenantWithSubscriptionsBuilder}
     * @summary The callback will be called on each subscription for the tenant.
     */
    onFailure(failed: SubscriptionFailed): TenantWithSubscriptionsBuilder {
        this.callbacks.onFailed(failed);
        return this;
    }

    /**
     * Build the {@link TenantSubscriptions} instance.
     * @returns {TenantWithSubscriptions}
     */
    build(): TenantWithSubscriptions {
        const subscriptions = this._subscriptionBuilders.map(_ => _.build());
        const tenantSubscriptions = new TenantWithSubscriptions(
            this._consumerTenant,
            subscriptions,
            this.callbacks);
        return tenantSubscriptions;
    }
}
