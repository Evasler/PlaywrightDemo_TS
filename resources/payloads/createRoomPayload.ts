import {
  roomFeature,
  roomType,
  type CreateRoomPayload,
} from "../../src/types/index.js";
import { faker } from "@faker-js/faker";
import { generalUtils } from "../../src/utils/index.js";
export function createRoomPayload(
  hardData: Partial<CreateRoomPayload> = {},
): CreateRoomPayload {
  const {
    roomName = `RM. ${generalUtils.padNumber(faker.number.int({ min: 1, max: 999 }), 3)}`,
    type = faker.helpers.arrayElement(roomType),
    accessible = faker.datatype.boolean(),
    description = faker.lorem.paragraph(),
    image = faker.image.urlPicsumPhotos({ width: 500, height: 500 }),
    roomPrice = faker.number.int({ min: 50, max: 500 }),
    features = faker.helpers.arrayElements(roomFeature),
  } = hardData;
  return {
    roomName,
    type,
    accessible,
    description,
    image,
    roomPrice,
    features,
  };
}
