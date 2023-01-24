import { NextFunction, Request, Response } from 'express';
import { IMatchService } from '../services/interfaces/IMatchService';
import statusCodes from '../utils/statusCodes';

export default class MatchController {
  constructor(private _service: IMatchService) {}

  public getAll =
  async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      let matches;
      const inProgressValue: string = req.query.inProgress as string;

      if (inProgressValue) matches = await this._service.getByInProgress(inProgressValue);

      else matches = await this._service.getAll();

      res.status(statusCodes.ok).json(matches);
    } catch (error) {
      next(error);
    }
  };
}
