import { useState } from 'react'

export const useDisclosure = (
	{ isOpen: defaultIsOpen = false, onOpen = () => {}, onClose: onClose1 = () => {} } = {
		isOpen: false,
		onOpen: () => {},
		onClose: () => {}
	}
) => {
	const [isOpen, setIsOpen] = useState<boolean>(defaultIsOpen)
	return {
		isOpen,
		onOpen: () => {
			onOpen?.()
			setIsOpen(true)
		},
		onClose: () => {
			onClose1?.()
			setIsOpen(false)
		},
		onToggle: () => {
			setIsOpen((prev) => !prev)
		}
	}
}
