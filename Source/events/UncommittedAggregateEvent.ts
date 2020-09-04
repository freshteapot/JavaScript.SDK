// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import { ArtifactId, Artifact } from '@dolittle/sdk.artifacts';

/**
 * Represents an uncommitted aggregate event
 */
export interface UncommittedAggregateEvent {
    /**
     * An artifact or an identifier representing the artifact.
     * @summary If no artifact identifier or artifact is supplied, it will look for associated artifacts based
     * on the actual type of the event.
     */
    artifact?: Artifact | ArtifactId;

    /**
     * The content of the event.
     */
    content: any;

    /**
     * Indicates whether the event is public or not.
     */
    public?: boolean;
}
