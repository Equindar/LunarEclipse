import { CustomEvent } from '../../types/CustomEvent.js';

const event: CustomEvent<'FaultedEvent'> = {
  name: 'FaultedEvent',
  execute() {
    // Hier können Sie die Logik implementieren, die ausgeführt werden soll, wenn das FaultedEvent ausgelöst wird.
    console.log('FaultedEvent wurde ausgelöst.');
  }
};

export default event;
