import React from 'react';

export interface EmergencyStopButtonProps {
    onTrigger: () => void;
    size?: number;
}

export declare function EmergencyStopButton(props: EmergencyStopButtonProps): JSX.Element;
export default EmergencyStopButton;
