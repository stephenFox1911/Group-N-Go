package com.groupngo.groupngo;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.groupngo.groupngo.dataService.DataService;

import java.util.ArrayList;

/**
 * Created by mickey on 11/16/14.
 */
public class TripItemAdapter extends ArrayAdapter<DataService.TripItem> {

    public TripItemAdapter(Context context, ArrayList<DataService.TripItem> tripItems) {
        super(context, 0, tripItems);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        // Get the data item for this position
        DataService.TripItem trip = getItem(position);
        // Check if an existing view is being reused, otherwise inflate the view
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(R.layout.trip_item, parent, false);
        }
        // Lookup view for data population
        TextView id = (TextView) convertView.findViewById(R.id.id);

        TextView slocationName = (TextView) convertView.findViewById(R.id.slocation);
        TextView elocationName = (TextView) convertView.findViewById(R.id.elocation);
        // Populate the data into the template view using the data object
        slocationName.setText("From: " + trip.slocation);
        elocationName.setText("To: " + trip.elocation);
        id.setText("ID: " + trip.id);
        // Return the completed view to render on screen
        return convertView;
    }
}
