import ProgressBar from '@/components/ProgressBar/ProgressBar';
import { Character } from '@/types/Character';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.js';

interface CharacterWidgetProps {
  character?: Character;
}

const CharacterWidget = (props: CharacterWidgetProps) => {
  return (
    <div className="w-1/8 absolute bottom-0 left-0 h-auto bg-background p-5 text-black opacity-60 dark:bg-background-dark dark:text-white">
      <h1 className="text-2xl font-bold">Character Widget</h1>
      <div>
        <Avatar>
          <AvatarImage src="/images/equindar.jpg" />
          <AvatarFallback>EQ</AvatarFallback>
        </Avatar>
      </div>
      <ul className="relative">
        <li>
          <ProgressBar amount="87" />
        </li>
        <li>Quest #2</li>
        <li>Quest #3</li>
      </ul>
    </div>
  );
};

export default CharacterWidget;
