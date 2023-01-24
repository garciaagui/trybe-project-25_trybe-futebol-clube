import { IMatch } from '../interfaces';
import Match from '../database/models/Match';
import { IMatchService } from './interfaces/IMatchService';
import Team from '../database/models/Team';
import MatchValidations from './validations/MatchValidations';

export default class MatchService implements IMatchService {
  constructor(private _model = Match) {}

  public async getAll(): Promise<IMatch[]> {
    const matches = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }

  public async getByInProgress(value: string | null): Promise<IMatch[]> {
    MatchValidations.validateInProgressValue(value);

    const condition = value === 'true';

    const matches = await this._model.findAll({
      where: { inProgress: condition },
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }
}