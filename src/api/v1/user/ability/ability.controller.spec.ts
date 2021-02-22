import { Test, TestingModule } from '@nestjs/testing';
import { AbilityController } from './ability.controller';
import { AbilityService } from './ability.service';

describe('AbilityController', () => {
  let controller: AbilityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AbilityController],
      providers: [AbilityService],
    }).compile();

    controller = module.get<AbilityController>(AbilityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
