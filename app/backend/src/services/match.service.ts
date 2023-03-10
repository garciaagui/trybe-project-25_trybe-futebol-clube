import { BadRequestException, NotFoundException } from '../exceptions';
import { INewMatch, IMatch } from '../interfaces';
import Match from '../database/models/Match';
import Team from '../database/models/Team';
import { IMatchService } from './interfaces';
import MatchValidations from './validations/MatchValidations';

export default class MatchService implements IMatchService {
  constructor(private _model = Match, private _auxiliarModel = Team) {}

  public async getAll(): Promise<IMatch[]> {
    const matches = await this._model.findAll({
      include: [
        { model: Team, as: 'homeTeam', attributes: { exclude: ['id'] } },
        { model: Team, as: 'awayTeam', attributes: { exclude: ['id'] } },
      ],
    });
    return matches;
  }

  public async getById(id: number): Promise<IMatch | null> {
    MatchValidations.validateId(id);

    const match = await this._model.findByPk(id);

    if (!match) throw new NotFoundException('Match not found');

    return match;
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

  public async create(match: INewMatch): Promise<IMatch> {
    MatchValidations.validateTeams(match.homeTeamId, match.awayTeamId);

    const teamsId = await Promise.all(
      [match.homeTeamId, match.awayTeamId]
        .map(async (id) => this._auxiliarModel.findByPk(id)),
    );

    const someTeamIsMissing = teamsId.some((id) => id === null);
    if (someTeamIsMissing) throw new NotFoundException('There is no team with such id!');

    const newMatch = await this._model.create({ ...match, inProgress: true });

    return newMatch;
  }

  public async updateInProgressStatus(id: number): Promise <number | null> {
    const match = await this.getById(id);

    if (!match?.inProgress) throw new BadRequestException('Match already finished');

    const [affectedCount] = await this._model.update({ inProgress: false }, { where: { id } });
    return affectedCount;
  }

  public async updateScore(id: number, homeGoals: number, awayGoals: number)
    : Promise <number | null> {
    MatchValidations.validateGoals(homeGoals, awayGoals);

    const match = await this.getById(id);

    if (!match?.inProgress) throw new BadRequestException('Match already finished');

    const [affectedCount] = await this._model.update(
      { homeTeamGoals: homeGoals, awayTeamGoals: awayGoals },
      { where: { id } },
    );
    return affectedCount;
  }
}
