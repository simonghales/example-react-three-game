import React, {ReactElement, useEffect} from "react";
import {gamePhysicsWorker} from "./worker";
import {buffers, handleBeginCollision, handleEndCollision, storedPhysicsData} from "./data";
import {WorkerMessageType, WorkerOwnerMessageType} from "../../../workers/physics/types";

const Physics: React.FC = ({children}) => {

    useEffect(() => {

        const loop = () => {
            if(buffers.positions.byteLength !== 0 && buffers.angles.byteLength !== 0) {
                gamePhysicsWorker.postMessage({ type: WorkerMessageType.STEP, ...buffers }, [buffers.positions.buffer, buffers.angles.buffer])
            }
        }

        gamePhysicsWorker.postMessage({
            type: WorkerMessageType.INIT,
            props: {
            }
        })

        loop()

        gamePhysicsWorker.onmessage = (event: MessageEvent) => {

            const type = event.data.type

            switch (type) {
                case WorkerOwnerMessageType.FRAME:

                    if (event.data.bodies) {
                        storedPhysicsData.bodies = event.data.bodies.reduce(
                            (acc: { [key: string]: number }, id: string) => ({
                                ...acc,
                                [id]: (event.data as any).bodies.indexOf(id)
                            }),
                            {}
                        )
                    }

                    const positions = event.data.positions as Float32Array
                    const angles = event.data.angles as Float32Array
                    buffers.positions = positions
                    buffers.angles = angles
                    requestAnimationFrame(loop);
                    break
                case WorkerOwnerMessageType.SYNC_BODIES:
                    storedPhysicsData.bodies = event.data.bodies.reduce(
                        (acc: { [key: string]: number }, id: string) => ({
                            ...acc,
                            [id]: (event.data as any).bodies.indexOf(id)
                        }),
                        {}
                    )
                    break
                case WorkerOwnerMessageType.BEGIN_COLLISION:
                    handleBeginCollision(event.data.props as any)
                    break
                case WorkerOwnerMessageType.END_COLLISION:
                    handleEndCollision(event.data.props as any)
                    break
            }

        }

    }, [])

    return children as ReactElement;
};

export default Physics;