import React, {useLayoutEffect, useRef} from "react";
import {containerPortal} from "../../../Player/components/PlayerUI/PlayerUI";

const AttackUIContainer: React.FC = () => {

    const containerRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        containerPortal.ref = containerRef
    }, [])

    return (<div ref={containerRef}></div>);
};

export default AttackUIContainer;