export default [
    {
        key: 'na altura da',
        data: {
            prev_location: true
        }
    },
    {
        key: 'na altura do',
        data: {
            prev_location: true
        }
    },
    {
        key: 'na pista sentido',
        data: {
            prev_location: true
        }
    },
    // IDEA: use hash's
    // {
    //     key: 'na %{data.location}',
    //     data: {
    //         prev_location: true
    //     }
    // },
    {
        key: 'na pista em direção a',
        data: {
            prev_location: true
        }
    },
    {
        key: 'na pista em direção ao',
        data: {
            prev_location: true
        }
    },
    {
        key: 'avenida brasil',
        variations: ['av. brasil'],
        data: {
            location: true,
            avenue: true,
            coordinates: []
        }
    },
    {
        key: 'penha',
        data: {
            location: true,
            neighborhood: true,
            coordinates: []
        }
    },
    {
        key: 'centro da cidade',
        variations: ['centro do rio'],
        data: {
            location: true,
            neighborhood: true,
            coordinates: []
        }
    },
]
