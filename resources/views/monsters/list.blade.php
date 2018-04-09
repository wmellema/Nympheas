@extends('layouts.app')
@section('title')
Monster list
@endsection
@section('content')
<div id="app">
    <!-- Components will go here -->
    <ais-index app-id="{{ env('ALGOLIA_APP_ID') }}"
           api-key="{{ env('ALGOLIA_SEARCH') }}"
           index-name="monsters">

	<ais-input placeholder="Search contacts..."></ais-input>

	<ais-results>
	   <template scope="{ result }">
		   <div>
			   <h1>@{{ result.name }}</h1>
			   <h4>@{{ result.company }} - @{{ result.state }}</h4>
			   <ul>
				   <li>@{{ result.email }}</li>
			   </ul>
		   </div>
	   </template>
	</ais-results>

</ais-index>
</div>

    <ul class="list-group">
      @foreach ($monsters as $monster)
      <li class="list-group-item"><img src="{{$monster->img_url}}" height="30px" /><a href="/monster/{{$monster->id}}">{{$monster->name}}</a></li>
      @endforeach
    </ul>

@endsection
