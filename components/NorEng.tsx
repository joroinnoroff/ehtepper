import React from 'react'

interface Props {
  setLanguage: (language: string) => void;
}


const options = [
  { value: 'Norwegian', label: 'Norwegian', shortHand: 'NO' },
  { value: 'English', label: 'English', shortHand: 'EN' },
]




const NorEng: React.FC<Props> = ({ setLanguage }) => {

  return (
    <>
      <div className='flex gap-2 items-center' >
        {options.map((option) => (
          <option key={option.value} value={option.value}  >
            {option.shortHand}  {option.shortHand === 'NO' && (<span>/</span>)}
          </option>
        ))}
      </div >
    </>
  )
}

export default NorEng