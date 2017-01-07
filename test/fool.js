import { expect } from 'chai';
import Fool from '../src/fool';
const data = 'Dois suspeitos foram mortos durante uma troca de tiros na tarde desta terça feira, na localidade conhecida como Couro Come, próximo à Rua Almirante Alexandrino, em Santa Teresa, na região central do Rio. Segundo o comando da UPP Coroa/Fallet/Fogueteiro, uma viatura foi atacada pelos acusados, que estavam em uma moto, durante um patrulhamento de rotina. Houve troca de tiros e os suspeitos acabaram baleados e não resistiram.';

describe('Fool', function() {

    it('should return data results', function() {
      const results = new Fool(data);
    //   expect(results).to.be
    });

});
