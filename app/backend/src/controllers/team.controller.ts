import { NextFunction, Request, Response } from 'express';
import { ITeamService } from '../services/interfaces/ITeamService';
import statusCodes from '../utils/statusCodes';

export default class TeamController {
  constructor(private _service: ITeamService) {}

  public getAll =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const teams = await this._service.getAll();

      res.status(statusCodes.ok).json(teams);
    } catch (error) {
      next(error);
    }
  };

  public getById =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const { id } = req.params;

      const team = await this._service.getById(Number(id));

      res.status(statusCodes.ok).json(team);
    } catch (error) {
      next(error);
    }
  };
}
