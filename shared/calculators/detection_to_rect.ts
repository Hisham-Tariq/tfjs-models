/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {normalizeRadians} from './image_utils';
import {ImageSize} from './interfaces/common_interfaces';
import {DetectionToRectConfig} from './interfaces/config_interfaces';
import {Detection} from './interfaces/shape_interfaces';

// ref:
// https://github.com/google/mediapipe/blob/master/mediapipe/calculators/util/detections_to_rects_calculator.cc
export function computeRotation(
    detection: Detection, imageSize: ImageSize, config: DetectionToRectConfig) {
  const locationData = detection.locationData;
  const startKeypoint = config.rotationVectorStartKeypointIndex;
  const endKeypoint = config.rotationVectorEndKeypointIndex;

  let targetAngle;

  if (config.rotationVectorTargetAngle) {
    targetAngle = config.rotationVectorTargetAngle;
  } else {
    targetAngle = Math.PI * config.rotationVectorTargetAngleDegree / 180;
  }

  const x0 = locationData.relativeKeypoints[startKeypoint].x * imageSize.width;
  const y0 = locationData.relativeKeypoints[startKeypoint].y * imageSize.height;
  const x1 = locationData.relativeKeypoints[endKeypoint].x * imageSize.width;
  const y1 = locationData.relativeKeypoints[endKeypoint].y * imageSize.height;

  const rotation =
      normalizeRadians(targetAngle - Math.atan2(-(y1 - y0), x1 - x0));

  return rotation;
}
