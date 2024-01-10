import React, { FC, useState } from "react";
import { ToggleButtonSetting } from "./ToggleButtonSetting";

interface SettingBarProps {
	toogle: number;
	settogle: any;
}

const SettingBar: FC<SettingBarProps> = ({ toogle, settogle }) => {

  const [isOpen, seIsOpen] = useState(false);
	const [state, setState] = useState(1);
	const [newAlert, setNewAlert] = useState(false)
  const toggleChatBar = () => {
		seIsOpen(!isOpen)
		if (!isOpen)
		settogle(2);
		else
		settogle(0);
		newAlert ? setNewAlert(!newAlert) : setNewAlert(newAlert)
	}
  
	return (
  
  
  <div>
    <ToggleButtonSetting isOpen={isOpen} isNewAlert={newAlert} setIsOpen={toggleChatBar} />

  </div>);
};

export default SettingBar;
