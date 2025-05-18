import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Place } from '../services/PlaceService';
import PlaceCard from './PlaceCard';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface MyScheduleListProps {
  schedule: Place[];
  setSchedule: (places: Place[]) => void;
  onRemove?: (index: number) => void;
}

const SortablePlaceItem: React.FC<{
  place: Place;
  id: string;
  index: number;
  onRemove?: (index: number) => void;
}> = ({ place, id, index, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    marginBottom: '1rem',
  };

  return (
    <Box ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <Paper
        variant="outlined"
        sx={{
          padding: 1.5,
          borderStyle: 'dashed',
          borderColor: '#ccc',
          borderRadius: 1,
          backgroundColor: '#fafafa',
        }}
      >
        <PlaceCard place={place} />
        {onRemove && (
          <Box mt={1} textAlign="right">
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={() => onRemove(index)}
            >
              삭제
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const MyScheduleList: React.FC<MyScheduleListProps> = ({
  schedule,
  setSchedule,
  onRemove,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = schedule.findIndex((place) => getPlaceId(place) === active.id);
    const newIndex = schedule.findIndex((place) => getPlaceId(place) === over.id);
    const newSchedule = arrayMove(schedule, oldIndex, newIndex);
    setSchedule(newSchedule);
  };

  // 고유 ID 생성 함수 (title + 좌표 조합)
  const getPlaceId = (place: Place) =>
    `${place.title}-${place.mapx}-${place.mapy}`;

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        📝 내 일정 (드래그 정렬 가능)
      </Typography>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={schedule.map(getPlaceId)}
          strategy={verticalListSortingStrategy}
        >
          {schedule.map((place, idx) => (
            <SortablePlaceItem
              key={getPlaceId(place)}
              id={getPlaceId(place)}
              index={idx}
              place={place}
              onRemove={onRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};

export default MyScheduleList;
