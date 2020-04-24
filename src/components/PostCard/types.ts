import PostData from '../../types/post-data';
import { UNITS } from '../../../common/constants';

export interface PostCardProps {
  data: PostData,
  units?: UNITS
}