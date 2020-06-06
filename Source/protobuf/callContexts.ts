// Copyright (c) Dolittle. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

import '@dolittle/sdk.protobuf';

import { ExecutionContext } from '@dolittle/sdk.execution';
import { CallRequestContext } from '@dolittle/runtime.contracts/Fundamentals/Services/CallContext_pb';
import executionContexts from './executionContexts';


function toProtobuf(executionContext: ExecutionContext): CallRequestContext {
    const callContext = new CallRequestContext();
    callContext.setExecutioncontext(executionContexts.toProtobuf(executionContext));
    return callContext;
}

export default {
    toProtobuf: toProtobuf
};
