import React  from 'react'
import { Link } from 'react-router-dom'
import Chip from 'material-ui/Chip'
import Button from 'material-ui/Button'

export default [
  {
    id: 'transport_no',
    label: 'Booking #',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'vehicle_type_name',
    label: 'Type',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'transport_name',
    label: 'Airline',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'Koli',
    label: 'Koli',
    data: (data) => `${data.min_koli}/${data.max_koli}`,
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'Weight',
    label: 'Weight(kg)',
    data: (data) => `${data.min_weight}/${data.max_weight}`,
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'transport_route',
    label: 'Vehicle #',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'to_node_name',
    label: 'Destination',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'eta',
    label: 'ETA',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'etd',
    label: 'ETD',
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'status',
    label: 'Booking Status',
    data: (data) => {
      return <Chip label={data.status_detail ? data.status_detail.value : '-'}  />
    },
    props: {
      sortable: 'true',
      padding: 'dense',
    }
  },
  {
    id: 'edit',
    label: '',
    data: (data) => {
      return (
        <Button color="primary" component={Link} to={`${location.pathname}/edit/${data.transport_id}`}>
          Edit
        </Button>
      )
    },
    props: {
      padding: 'dense',
    }
  }
];
